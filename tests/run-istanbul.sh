#!/bin/bash

TEST_SCRIPT=$1
shift

exec node_modules/.bin/istanbul cover --print none --report none --dir "./coverage/$(echo "${TEST_SCRIPT}" | sha256sum | awk '{print $1;}')" "${TEST_SCRIPT}" -- $@
