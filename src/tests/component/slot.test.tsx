import Yui from '../../YA';

function HasSlotComp(states){
    return <div><slot map={{'user':states.outer_user,'profile':states.outer_profile}} /></div>
}

function UseSlotComp(states){
    debugger
    let slotUser = Yui.local(undefined,'slot-user');
    let slotProfile = Yui.local(undefined, 'slot-profile');
    return <HasSlotComp outer_user={states.user} outer_profile={states.profile} slot-map={{"user":slotUser,"profile":slotProfile}}>
        <div>
            <label>用户名</label><span>{slotUser.name}</span>
            {states.message}
            <label>性别</label><span>{slotProfile.gender}</span>
        </div>
    </HasSlotComp>
}

let app = new Yui({
    element:document.body,
    template:<UseSlotComp 
        user={{name:"yiy"}}
        profile={{gender:"male"}}
        message="[ok]"
    />
});
