/*
contract Bucketlist =
  record state = {
    index_counter : int,
    bucketlist : map(int, string),
    completed : map(int, bool) }
    
  public stateful entrypoint init() =
    { index_counter = 0,
      bucketlist = {},
      completed = {}}
  public entrypoint get_task_count() : int = 
    state.index_counter
  public stateful entrypoint add_new_bucketlist(_newbucketlist : string) : string =
    put(state{bucketlist[state.index_counter] = _newbucketlist })
    put(state{completed[state.index_counter] = false})
    put(state{index_counter = state.index_counter + 1})
    _newbucketlist
  
  public stateful entrypoint complete_bucketlist(_index : int) : bool =
    put(state{completed[_index] = true })
    true
  public entrypoint get_bucketlist_by_index(_index:int) : string =
    switch(Map.lookup(_index, state.bucketlist))
      None => ""
      Some(x) => x
      
  public entrypoint bucketlist_is_completed(_index : int) : bool =
    switch(Map.lookup(_index, state.completed))
      None => false
      Some(x) => x
      
  public entrypoint get_bucket_list_length() : int = 
    state.index_counter
*/

const CONTRACTSOURCE = `
contract Bucketlist =
  record state = {
    index_counter : int,
    bucketlist : map(int, string),
    completed : map(int, bool) }
    
  public stateful entrypoint init() =
    { index_counter = 0,
      bucketlist = {},
      completed = {}}
  public entrypoint get_task_count() : int = 
    state.index_counter
  public stateful entrypoint add_new_bucketlist(_newbucketlist : string) : string =
    put(state{bucketlist[state.index_counter] = _newbucketlist })
    put(state{completed[state.index_counter] = false})
    put(state{index_counter = state.index_counter + 1})
    _newbucketlist
  
  public stateful entrypoint complete_bucketlist(_index : int) : bool =
    put(state{completed[_index] = true })
    true
  public entrypoint get_bucketlist_by_index(_index:int) : string =
    switch(Map.lookup(_index, state.bucketlist))
      None => ""
      Some(x) => x
      
  public entrypoint bucketlist_is_completed(_index : int) : bool =
    switch(Map.lookup(_index, state.completed))
      None => false
      Some(x) => x
      
  public entrypoint get_bucket_list_length() : int = 
    state.index_counter
`; // sophia code

const CONTRACTADDRESS = 'ct_214UFu6v1772fpsaRW1bUUzGTHMivYYpQt7yt6CuTggT9164fx'; //contract addressed deployed
var client = null; // client
var bucketlistArr = [];  // an empty array
var bucketlistLength  = 0; 

console.log(CONTRACTADDRESS)

//helper function
async function callStatic(func, args){
  const contract = await client.getContractInstance(CONTRACTSOURCE, {CONTRACTADDRESS});
  const calledGet = await contract.call(func, args, {callStatic:true}).catch(e => console.error(e));
  const decodedGet = await calledGet.decode().catch(e => console.error(e));
  return decodedGet;
}

// loader 
window.addEventListener('load', async() => {
  client = await Ae.Aepp(); // ae object
  bucketlistLength = await callStatic('get_bucket_list_length',[]);
  // cons
  console.log(bucketlistLength);
  for(let i = 1; i <= bucketlistLength; i++){
    const getbucketlist = await callStatic('get_bucketlist_by_index', [i]);
    bucketlistArr.push({
      index_counter:getbucketlist.index_counter,
      bucketlist:getbucketlist.bucketlist,
      completed:getbucketlist.completed
    })
  }
  renderBucketList();
});
function renderBucketList(){
  var template = $("#template").html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {bucketlistArr});
  $("#bucketListBody").html(rendered);
}
// Mustache Render Function

/*
var mockArray = [
  {"index_counter":0, "bucket_list":"Program Java", "Done":false},
  {"index_counter":1, "bucket_list":"Program C++", "Done":false},
  {"index_couner":2, "bucket_list":"Program Java", "Done":true}
]

function renderMockArray(){
  var template = $("#template").html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {mockArray});
  $("#bucketListBody").html(rendered);
}

window.addEventListener('load', async() => {
  renderMockArray();
});

$('#addBucketListBtn').click(async function(){
  // console.log("Hello")
  var bucketlist = ($('#bucketlist').val());
  mockArray.push({
    index_counter:mockArray.length + 1,
    bucket_list: bucketlist,
    Done:false
  });

  renderMockArray();
 
})
*/
