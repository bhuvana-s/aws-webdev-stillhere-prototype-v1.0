#!/usr/bin/env bash
#
# StillHere prototype — full AWS teardown.
#
# Removes every resource the deploy script created:
#   - Amplify domain association for prototype.stillhere4u.com
#   - Amplify app stillhere-prototype (deletes all branches + builds + logs)
#   - Route 53 records that Amplify left behind (idempotent — skips if absent)
#   - IAM role StillHerePrototype-AmplifySSRRole (detaches policies first)
#
# DELIBERATELY PRESERVED:
#   - ACM wildcard cert *.stillhere4u.com (tag Project=stillhere4u-shared).
#     This cert is shared across all subdomains of stillhere4u.com and
#     should outlive the prototype.
#
# All prototype-only resources are tagged Project=stillhere-prototype.
# Locate them via:
#   aws resourcegroupstaggingapi get-resources \
#     --tag-filters Key=Project,Values=stillhere-prototype
#
# Safe to re-run — every step is idempotent and tolerates missing resources.

set -uo pipefail

REGION="${AWS_REGION:-us-east-1}"
APP_NAME="stillhere-prototype"
DOMAIN="stillhere4u.com"
SUB_DOMAIN_FULL="prototype.${DOMAIN}"
ROLE_NAME="StillHerePrototype-AmplifySSRRole"
ZONE_ID="Z04054891IKIRI1WNYAZ5"

echo "=== StillHere prototype teardown ==="
echo "  region:  $REGION"
echo "  app:     $APP_NAME"
echo "  domain:  $SUB_DOMAIN_FULL"
echo "  role:    $ROLE_NAME"
echo ""

# ----- 1. Amplify app -------------------------------------------------------

APP_ID=$(aws amplify list-apps --region "$REGION" \
  --query "apps[?name=='${APP_NAME}'].appId | [0]" --output text 2>/dev/null)

if [ -n "$APP_ID" ] && [ "$APP_ID" != "None" ]; then
  echo "[1/4] Deleting Amplify domain association on app $APP_ID ..."
  aws amplify delete-domain-association \
    --app-id "$APP_ID" \
    --domain-name "$DOMAIN" \
    --region "$REGION" >/dev/null 2>&1 \
    && echo "      removed domain association" \
    || echo "      no domain association (skipped)"

  echo "[2/4] Deleting Amplify app $APP_ID ..."
  aws amplify delete-app --app-id "$APP_ID" --region "$REGION" >/dev/null
  echo "      app deleted"
else
  echo "[1/4] No Amplify app named $APP_NAME — skipped"
  echo "[2/4] (already gone)"
fi

# ----- 3. Route 53 leftover records ----------------------------------------
# Amplify usually cleans these up itself, but in case anything dangles
# (e.g. an _acme verification record), sweep any records matching the
# prototype subdomain.

echo "[3/4] Sweeping leftover Route 53 records for $SUB_DOMAIN_FULL ..."

RECORDS=$(aws route53 list-resource-record-sets \
  --hosted-zone-id "$ZONE_ID" \
  --query "ResourceRecordSets[?contains(Name, '${SUB_DOMAIN_FULL}')]" \
  --output json 2>/dev/null)

if [ "$RECORDS" = "[]" ] || [ -z "$RECORDS" ]; then
  echo "      no leftover records"
else
  CHANGES=$(echo "$RECORDS" | jq -c '[.[] | {Action:"DELETE", ResourceRecordSet: .}]')
  if [ -n "$CHANGES" ] && [ "$CHANGES" != "null" ]; then
    aws route53 change-resource-record-sets \
      --hosted-zone-id "$ZONE_ID" \
      --change-batch "{\"Changes\": $CHANGES}" >/dev/null 2>&1 \
      && echo "      deleted $(echo "$RECORDS" | jq 'length') records" \
      || echo "      delete attempt failed (records may need manual cleanup)"
  fi
fi

# ----- 4. IAM role ----------------------------------------------------------

echo "[4/4] Deleting IAM role $ROLE_NAME ..."

# Detach managed policies
for POL in $(aws iam list-attached-role-policies --role-name "$ROLE_NAME" \
    --query 'AttachedPolicies[*].PolicyArn' --output text 2>/dev/null); do
  aws iam detach-role-policy --role-name "$ROLE_NAME" --policy-arn "$POL" 2>/dev/null \
    && echo "      detached $POL"
done

# Delete inline policies
for POL in $(aws iam list-role-policies --role-name "$ROLE_NAME" \
    --query 'PolicyNames[*]' --output text 2>/dev/null); do
  aws iam delete-role-policy --role-name "$ROLE_NAME" --policy-name "$POL" 2>/dev/null \
    && echo "      deleted inline policy $POL"
done

aws iam delete-role --role-name "$ROLE_NAME" 2>/dev/null \
  && echo "      role deleted" \
  || echo "      role already gone (skipped)"

echo ""
echo "=== Teardown complete ==="
echo "Verify with:"
echo "  aws resourcegroupstaggingapi get-resources \\"
echo "    --tag-filters Key=Project,Values=stillhere-prototype --region $REGION"
