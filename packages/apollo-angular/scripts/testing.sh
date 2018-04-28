#!/bin/sh -e

echo "[Deploy] Copying testing files"

cd ./build
cd ./testing && cp -r ./ ../../npm/testing
cd ../../
