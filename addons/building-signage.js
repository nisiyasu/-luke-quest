(() => {
'use strict';

/* Collision-safe add-on: readable building sign plaques for Royal Capital services and home. */
const SIGNS={lqInnDoor:['INN','南門宿'],lqShopDoor:['SHOP','ミナの道具屋'],lqTempleDoor:['TEMPLE','王国神殿'],lqResidenceDoor:['HOME','仕立屋の家']};
const style=document.createElement('style');style.textContent=`
.lqBuildingSign{position:absolute;z-index:11;left:50%;top:-15px;transform:translateX(-50%);min-width:48px;padding:2px 5px;border-radius:4px;background:linear-gradient(#765a35,#493522);border:1px solid #c1975c;color:#f1d89c;font-size:6px;font-weight:950;letter-spacing:.1em;text-align:center;box-shadow:0 3px 5px #0008;pointer-events:none}.lqBuildingSign small{display:block;color:#bca981;font-size:5px;letter-spacing:0;margin-top:1px}.lqDoorTemple .lqBuildingSign{background:linear-gradient(#536977,#304550);border-color:#b7c5cc;color:#edf4f6}.lqDoorShop .lqBuildingSign{background:linear-gradient(#52633f,#34442f);border-color:#a7bd77;color:#e3edb6}
`;document.head.appendChild(style);
function addSigns(){if(s.screen!=='world'||s.map!=='town')return;for(const el of app.querySelectorAll('.lqBuildingDoor')){if(el.querySelector('.lqBuildingSign'))continue;const cls=Object.keys(SIGNS).find(k=>el.classList.contains(EXACT=k));}
}
function decorate(){
 if(s.screen!=='world'||s.map!=='town')return;for(const el of app.querySelectorAll('.lqBuildingDoor')){if(el.querySelector('.lqBuildingSign'))continue;let found=null;for(const [cls,data] of Object.entries(SIGNS))if(el.classList.contains(cls)){found=data;break;}if(!found)continue;const e=document.createElement('span');e.className='lqBuildingSign';e.innerHTML=`${found[0]}<small>${found[1]}</small>`;el.appendChild(e);}
}
const worldB=world;world=function(){worldB();decorate();};const renderB=render;render=function(){const r=renderB();decorate();return r;};window.LQ_BUILDING_SIGN_STATUS={inn:true,shop:true,temple:true,residence:true};decorate();
})();
