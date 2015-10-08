#!/bin/bash
if [ -e build ]
then
	rm -rf build/*
else
	mkdir build
fi

babel src/iso.js --out-file build/iso.js