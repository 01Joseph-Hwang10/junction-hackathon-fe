#!/bin/sh

tsc --outDir ./res2/res $1 && python scripts/remove-undefined.py
