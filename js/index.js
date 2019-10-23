const contractSource = `
contract BucketList =
  record bucketlists_rec= {name:string}

  record state = {
    index_counter : int,
    bucketlist : map(int, bucketlists_rec)}
    
  stateful entrypoint init() =
    { index_counter = 0,
      bucketlist = {} }
    
  stateful entrypoint add_new_bucketlist(_newbucketlist : string)=
    let bucketlists_rec ={name =_newbucketlist }
    let index = state.index_counter + 1
    put(state{bucketlist[index] = bucketlists_rec, index_counter=index})


      
  entrypoint get_bucket_list_length() : int = 
    state.index_counter


  entrypoint get_bucketlist_by_index(_index:int)=
    switch(Map.lookup(_index, state.bucketlist))
      None => abort("There was no bucketlis with this index.")
      Some(x) => x
      
            
`;

const contractAddress = 'ct_2HKuohTiT9EJ9o111z4LgDxRoCVwXzyC5dSmwEga3ASoB6npZM';
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
  // console.log("Contract : ", contract)
  const calledGet = await contract.call(func, args, {callStatic: true}).catch(e => console.error(e));
  //Make another call to decode the data received in first call
  // console.log("Called get found: ",  calledGet)
  const decodedGet = await calledGet.decode().catch(e => console.error(e));
  // console.log("catching errors : ", decodedGet)
  return decodedGet;
}

//Create a asynchronous write call for our smart contract
async function contractCall(func, args, value) {
  // client = await Ae.Aepp()
  // console.log(`calling a function on a deployed contract with func: ${func}, args: ${args} and options:`, value)
  // return client.contractCall(contractAddress, 'sophia-address', contractAddress, func, { args, value })

  // client = await Ae.Aepp();
  const contract = await client.getContractInstance(contractSource, {contractAddress});
  console.log("Contract:", contract)
  //Make a call to write smart contract func, with aeon value input
  // const calledSet = await contract.call(func, args, {amount:value}).catch(e => console.error(e));
  const calledSet = await contract.call(func, args, {amount:value}).catch(e => console.error(e));
  console.log("CalledSet", calledSet)
  return calledSet;


}

function renderBucketList(){
  let template = $('#template').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {bucketlistArr});
  $("#bucketListBody").html(rendered);
  console.log("Mustashe Template Display")
}

window.addEventListener('load', async() => {
  $("#loader").show();

  client = await Ae.Aepp();

  bucketlistLength = await callStatic('get_bucket_list_length',[]);
  
  console.log('BucketList Count: ', bucketlistLength);

  for(let i = 1; i < bucketlistLength + 1; i++){
    const getbucketlist = await callStatic('get_bucketlist_by_index', [i]);
    bucketlistArr.push({
      index_counter:i,
      bucketlist:getbucketlist.name,
    })
  }
  renderBucketList();

  $("#loader").hide();
});

//If someone clicks to register a moment, get the input and execute the registerCall
$('#addBucketListBtn').click(async function(){
  $("#loader").show();
  console.log("Button Clicked")
  const new_bucketlist = ($('#bucketlist').val());
  console.log("-------------------------------------")
  console.log("Val:",new_bucketlist)
  const shit = await contractCall('add_new_bucketlist', new_bucketlist,0);
  console.log("SAVED TO THE DB", shit)
  bucketlistArr.push({
    index_counter: bucketlistLength.length + 1,
    bucketlist: new_bucketlist,
  })


  renderBucketList();
  $("#loader").hide();
    //This will clear the value in all scenarious
    var input = document.getElementById("bucketlist");
    input.value = ""
      
  // e.preventDefault();

});


// ak_2bKhoFWgQ9os4x8CaeDTHZRGzUcSwcXYUrM12gZHKTdyreGRgG

// https://goodnessezeokafor.github.io/Dacade-Challenge/