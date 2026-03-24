/* prefs.js — User Preferences (Bonus: Enhanced Features) | HopeScholar */
'use strict';
const PREFS_KEY='hopescholar_prefs_v1';
const Prefs={data:{},init(){try{const r=localStorage.getItem(PREFS_KEY);this.data=r?JSON.parse(r):{};}catch{this.data={};}this._restore();},set(k,v){this.data[k]=v;try{localStorage.setItem(PREFS_KEY,JSON.stringify(this.data));}catch{}},get(k,fb=''){return this.data[k]??fb;},_restore(){['schol-cat','schol-region','schol-sort','uni-country','uni-sort','country-region','country-sort'].forEach(id=>{const el=document.getElementById(id);const v=this.get(id);if(el&&v)el.value=v;});}};
document.addEventListener('DOMContentLoaded',()=>{['schol-cat','schol-region','schol-sort','uni-country','uni-sort','country-region','country-sort'].forEach(id=>{document.getElementById(id)?.addEventListener('change',e=>Prefs.set(id,e.target.value));});});
