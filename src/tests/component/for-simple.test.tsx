import Yui from '../../YA';
function Comp1(states){
    let change = (states)=>{
        states.genders = [{value:undefined,text:"请选择"},{value:10,text:'启用'},{value:20,text:'禁用'}]
        debugger
    }
    let gender = Yui.localFor(states.genders);
    return <div><select><option for-each={states.genders} for-as={gender} value={gender.value}>{gender.text}</option></select><button onclick={change}>变化</button></div>;
}

let app = new Yui({
    element:document.body,
    template:<Comp1 inputText="yi" genders={[{value:1,text:'male'},{value:0,text:'female'}]}/>
});
