#!/bin/bash

let "idx=1"
for f in ~/dangerbox/72x72/*.png
do
    echo $idx
    echo "cp $f data/$idx.png"
    cp $f data/$idx.png
    let "idx=idx+1"
done
