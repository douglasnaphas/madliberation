#!/usr/bin/env bash

git clone https://github.com/douglasnaphas/madliberation-itest.git
cd madliberation-itest
npm install

IT_ROOM_CODE=$(npx . --site https://staging.passover.lol | awk '{print $3}')
if [[ -z ${IT_ROOM_CODE} ]]
then
  echo "empty IT_ROOM_CODE: ${IT_ROOM_CODE}"
  exit 1
fi
echo "created room code ${IT_ROOM_CODE}"

# cleanup
aws sts get-caller-identity

# get info about the seder with the returned room code, to make extraz sure
# that it's an integration test seder before we delete it
ITEMS=$(aws dynamodb query \
  --table-name seders \
  --key-condition-expression "room_code = :rc" \
  --expression-attribute-values '{":rc":{"S":"'${IT_ROOM_CODE}'"}}' \
  --projection-expression 'room_code, lib_id, game_name, closed' \
  | \
  jq '.["Items"]')

# there should be 3 items
NUM_ITEMS=$(echo "${ITEMS}" | jq '. | length')
if [[ "${NUM_ITEMS}" -ne "3" ]]
then
  echo "wrong NUM_ITEMS: ${NUM_ITEMS}, should be 3"
  exit 1
fi

# one should be a seder, the other two should start with participant#
# there should be a participant in this seder with the name "ITestLdr <room code>"
LDR_NAME="ITestLdr ${IT_ROOM_CODE}"
LDR_COUNT=$(echo "${ITEMS}" | \
  jq '[.[] | select((.["lib_id"]["S"] | startswith("participant#")) and (.["game_name"]["S"] == "'"${LDR_NAME}"'"))] | length')
if [[ "${LDR_COUNT}" -ne "1" ]]
then
  echo "wrong LDR_COUNT: ${LDR_COUNT}, should be 1"
  exit 1
fi

# there should be a participant in this seder with the name "ITestP2 <room code>"
P2_NAME="ITestP2 ${IT_ROOM_CODE}"
P2_COUNT=$(echo "${ITEMS}" | \
  jq '[.[] | select((.["lib_id"]["S"] | startswith("participant#")) and (.["game_name"]["S"] == "'"${P2_NAME}"'"))] | length')
if [[ "${P2_COUNT}" -ne "1" ]]
then
  echo "wrong P2_COUNT: ${P2_COUNT}, should be 1"
  exit 1
fi

# seder
# lib_id should be seder
# closed should be true
SEDER_COUNT=$(echo "${ITEMS}" | \
  jq '[.[] | select((.["lib_id"]["S"] == "seder") and (.["closed"]["BOOL"] == true))] | length')
if [[ "${SEDER_COUNT}" -ne "1" ]]
then
  echo "wrong SEDER_COUNT: ${SEDER_COUNT}, should be 1"
  exit 1
fi

# delete participants (because deleting the seder marks it as available)
# figure out exact participant lib_ids
echo "LDR_NAME: ${LDR_NAME}"
echo "P2_NAME: ${P2_NAME}"
LDR_LIB_ID=$(echo "${ITEMS}" | \
  jq '.[] | select((.["game_name"]["S"] == "'"${LDR_NAME}"'") and (.["lib_id"]["S"] | startswith("participant#"))) | .["lib_id"]["S"]' | tr -d '"')
if [[ -z ${LDR_LIB_ID} ]]
then
  echo "empty LDR_LIB_ID: ${LDR_LIB_ID}"
  exit 1
fi
P2_LIB_ID=$(echo "${ITEMS}" | \
  jq '.[] | select((.["game_name"]["S"] == "'"${P2_NAME}"'") and (.["lib_id"]["S"] | startswith("participant#"))) | .["lib_id"]["S"]' | tr -d '"')
if [[ -z ${P2_LIB_ID} ]]
then
  echo "empty P2_LIB_ID: ${P2_LIB_ID}"
  exit 1
fi
# delete leader
aws dynamodb delete-item \
  --table-name seders \
  --key \
    '{"room_code":{"S":"'${IT_ROOM_CODE}'"},"lib_id":{"S":"'${LDR_LIB_ID}'"}}'
# delete p2
aws dynamodb delete-item \
  --table-name seders \
  --key \
    '{"room_code":{"S":"'${IT_ROOM_CODE}'"},"lib_id":{"S":"'${P2_LIB_ID}'"}}'
# delete seder
aws dynamodb delete-item \
  --table-name seders \
  --key \
    '{"room_code":{"S":"'${IT_ROOM_CODE}'"},"lib_id":{"S":"seder"}}' \
  --condition-expression 'closed = :t' \
  --expression-attribute-values '{":t":{"BOOL":true}}'
  