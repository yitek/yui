import Yui from '../../yui';
function Comp1(states){
    let gender = Yui.localFor(states.genders);
    return <select><option for={{each:states.genders,as:gender}} value={gender.value}>[states.pre]{gender.text}</option></select>;
}
