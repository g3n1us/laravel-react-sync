import React, { Component } from 'react';

export function Csrf(props){
    const token_val = (document.querySelector('meta[name="csrf-token"]') || {}).content;
    return <input type="hidden" name="_token" defaultValue={token_val} />;
}
