const contractSource = `
  contract BucketList =
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
        None => abort("There was no bucketlis with this index.")
        Some(x) => x
        
    public entrypoint bucketlist_is_completed(_index : int) : bool =
      switch(Map.lookup(_index, state.completed))
        None => abort("There was no bucketlis with this index.")
        Some(x) => x
        
    public entrypoint get_bucket_list_length() : int = 
      state.index_counter
`;

const contractAddress = 'ct_2h2wvCDd9qNvbmJsmXzrAfjqyD2Qz8sZsV35Y1DF5UYSw1di4T';
var client = null;
var bucketlistArr = [];
var bucketlistLength  = 0; 

// console.log("Contract Address:",contractAddress)

// async function callStatic(func, args) {
//   const contract = await client.getContractInstance(contractSource, {contractAddress});
//   console.log('Function: ', func);
//   console.log('Argument: ', args);
//   const calledGet = await contract.call(func, args, {callStatic: true}).catch(e => console.error(e));
//   console.log('calledGet', calledGet);
//   const decodedGet = await calledGet.decode().catch(e => console.error(e));

//   return decodedGet;
// }
async function callStatic(func, args) {
  //Create a new contract instance that we can interact with
  const contract = await client.getContractInstance(contractSource, {contractAddress});
  //Make a call to get data of smart contract func, with specefied arguments
  console.log("Contract : ", contract)
  const calledGet = await contract.call(func, args, {callStatic: true}).catch(e => console.error(e));
  //Make another call to decode the data received in first call
  console.log("Called get found: ",  calledGet)
  const decodedGet = await calledGet.decode().catch(e => console.error(e));
  console.log("catching errors : ", decodedGet)
  return decodedGet;
}

//Create a asynchronous write call for our smart contract
async function contractCall(func, args, value) {
  const contract = await client.getContractInstance(contractSource, {contractAddress});
  //Make a call to write smart contract func, with aeon value input
  const calledSet = await contract.call(func, args, {amount:value}).catch(e => console.error(e));

  return calledSet;
}

function renderBucketList(){
  let template = $('#template').html();
  Mustache.parse(template);
  let rendered = Mustache.render(template, {bucketlistArr});
  $("#bucketListBody").html(rendered);
}

window.addEventListener('load', async() => {
  $("#loader").show();

  client = await Ae.Aepp();

  bucketlistLength = await callStatic('get_bucket_list_length',[]);
  
  console.log('BucketList Count: ', bucketlistLength);

  for(let i = 1; i < bucketlistLength; i++){
    const getbucketlist = await callStatic('get_bucketlist_by_index', [i]);
    bucketlistArr.push({
      index_counter:getbucketlist.index_counter,
      bucketlist:getbucketlist.bucketlist,
      completed:getbucketlist.completed
    })
  }
  renderBucketList();

  $("#loader").hide();
});

//If someone clicks to register a moment, get the input and execute the registerCall
$('#addBucketListBtn').click(async function(){
  $("#loader").show();
  console.log("Button Clicked")
  const bucketlist = ($('#bucketlist').val());
  console.log("-------------------------------------")
  console.log("Contract Adderss", contractAddress)
  console.log("Bucketlist:", bucketlist)
  await contractCall('add_new_bucketlist', bucketlist, 0);
  
  bucketlistArr.push({
    index_counter: bucketlistArr + 1,
    bucketlist: bucketlist,
  })

  renderBucketList();
  $("#loader").hide();

});


// ak_2bKhoFWgQ9os4x8CaeDTHZRGzUcSwcXYUrM12gZHKTdyreGRgG