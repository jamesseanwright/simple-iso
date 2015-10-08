#!/bin/bash
babel tests --out-file __tests.js
mocha __tests.js
# rm __tests.js