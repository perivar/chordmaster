#!/usr/bin/env bash

while IFS='=' read -r key value; do
    # Re-set the variable using parameter expansion with removing of all double quotes:
    # ${parameter//pat/string}
    # http://mywiki.wooledge.org/BashGuide/Parameters#Parameter_Expansion
    
    # does this work for empty variables?
    cleanValue="${value//\"/}"
    
    # use sed instead? 
    #cleanValue=$(echo "$value" | sed -E "s|^(['\"])(.*)\1$|\2|g") 
    
    echo "Processing $key=$cleanValue"   
    eas secret:create --scope project --name "$key" --value "$cleanValue" --force

done < .env
