import * as yui from '../yui';
let vm ={
    pageIndex:1,
    pageSize:5,
    filter:{
        keyword:"",
        userid:"guid",
        provincies:['sc','cq'],
        createTime_min:"2020-5-3",
        createTime_max:"2020-7-15"
    },
    total:0,
    rows:[
        {__DEF__:true,id:"guid",name:"yiy",creator:{id:"guid",displayName:"yiy"},createTime:"2020-6-1",provice:"cq"}
    ],
    permissions:{
        id:"readonly",name:"readonly"
    }
};
console.group("测试Schema");
let schema = (new yui.Schema(vm));
console.log("创建了一个schema",schema,vm);
let reactive = schema.createReactive();
console.log(`创建了一个reactive`,reactive);
let old = reactive.get();
console.log(`从reactive中获取数据`,old);
(reactive as any).filter.keyword.subscribe((e)=>{
    console.log('root.filter.keyword的值发生了变化',e.value,e);
});
reactive.update({pageIndex:2,filter:{keyword:"yiy"},rows:[ {__DEF__:1,id:"1",name:"yi",creator:{id:"2",displayName:"y"},createTime:"2020-6-2",provice:"sc"}]});
console.log(`给reactive更新数据`,reactive.get());
console.groupEnd();