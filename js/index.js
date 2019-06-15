/*
contract ToDoManager =
  record state = {
    index_counter : int,
    m_index_to_do : map(int, string),
    m_to_do_done : map(int, bool) }
    
  
  public stateful function init() =
    { index_counter = 0,
      m_index_to_do = {},
      m_to_do_done = {}}
  
  public function get_task_count() : int = 
    state.index_counter
  
  public stateful function add_to_do(_to_do : string) : string =
    put(state{m_index_to_do[state.index_counter] = _to_do })
    put(state{m_to_do_done[state.index_counter] = false})
    put(state{index_counter = state.index_counter + 1})
    _to_do
  
  public stateful function complete_task(_index : int) : bool =
    put(state{m_to_do_done[_index] = true })
    true
  
  public function get_task_by_index(_index:int) : string =
    switch(Map.lookup(_index, state.m_index_to_do))
      None => ""
      Some(x) => x
      
  public function task_is_completed(_index : int) : bool =
    switch(Map.lookup(_index, state.m_to_do_done))
      None => false
      Some(x) => x
    
    
*/

const CONTRACTADDRESS = 'ct_UDebhCQp8j3PUxgBfDmo2qoTuNA686CKV41o4zpsFkz69cbLx'; //contract addressed deployed
const CONTRACTSOURCE = `
contract ToDoManager =
  record state = {
    index_counter : int,
    bucketlist : map(int, string),
    completed : map(int, bool) }
    

  public stateful function init() =
    { index_counter = 0,
      bucketlist = {},
      completed = {}}

  public function get_task_count() : int = 
    state.index_counter

  public stateful function add_new_bucketlist(_newbucketlist : string) : string =
    put(state{bucketlist[state.index_counter] = _newbucketlist })
    put(state{completed[state.index_counter] = false})
    put(state{index_counter = state.index_counter + 1})
    _newbucketlist

  public stateful function complete_bucketlist(_index : int) : bool =
    put(state{completed[_index] = true })
    true

  public function get_bucketlist_by_index(_index:int) : string =
    switch(Map.lookup(_index, state.bucketlist))
      None => ""
      Some(x) => x
      
  public function bucketlist_is_completed(_index : int) : bool =
    switch(Map.lookup(_index, state.completed))
      None => false
      Some(x) => x
      
  public function get_bucket_list_length() : int = 
    state.index_counter

  `; // sophia code

var client = null; // client
var bucketlistArr = [];  // an empty array
var bucketlistLength  = 0; 


//helper function
async function callStatic(func, args){
  const contract = await client.getContractInstance(CONTRACTSOURCE, {CONTRACTADDRESS});
  const calledGet = await contract.call(func, args, {callStatic:true}).catch(e => console.error(e));
  const decodedGet = await calledGet.decoded().catch(e => console.error(e));

  return decodedGet;
}

// loader 
window.addEventListener('load', async() => {
  client = await Ae.Aepp(); // ae object

  bucketlistLength = await callStatic('get_bucket_list_length',[]);
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