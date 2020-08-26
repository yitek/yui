import Yui from '../../YA';
function Comp1(states){
    let col = Yui.localFor(states.cols,'col');
    let row = Yui.localFor(states.rows,'row');
    let displayCol = (row,col) =>{
        return row[col.name];
    };
return <table border="1"><tbody><tr for-each={states.rows} for-as={row}><td for-each={states.cols} for-as={col}>{Yui.computed(row,col,displayCol)}</td></tr></tbody></table>;
}

let app = new Yui({
    element:document.body,
    template:<Comp1 
        cols={[{name:'id',text:'id'},{name:'mail',text:'display name'}]}
        rows={[{id:1,mail:'1@ya.com'},{id:2,mail:'2@ya.com'}]}
    />
});
