#!/usr/bin/env bash

##################################################################################
# Request cache invalidation for all objects in the IMSC Cloudfront distribution #
##################################################################################

set -e

IMSC_CLOUDFRONT_DISTRIBUTION_ID=E1XJDJVR1A96M1

aws cloudfront create-invalidation --distribution-id ${IMSC_CLOUDFRONT_DISTRIBUTION_ID} --paths "/*"
