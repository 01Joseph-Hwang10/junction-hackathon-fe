#!/bin/sh

tsc --outDir ./res $1 && python scripts/remove-undefined.py
