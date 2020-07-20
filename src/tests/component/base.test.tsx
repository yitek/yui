import Yui from '../../yui';
class MyComponent{
    onkeypress(states,event){
        states.inputText = event.target.value;
    }
    template(states:any){
        return <div>
            <input type="text" value={states.inputText} onkeyup={this.onkeypress} />
            <div>你输入的字符是:{states.inputText}</div>
        </div>
    }
}
let app = new Yui({
    element:document.body,
    template:<MyComponent inputText="yi" />
});