const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

//create a global variable to hold the json sample data
var jsonSamples
var metaData

// Fetch the JSON data 
//call then on the promise and pass back a callback function
//a callback function is a function to call whenever the promise completes
//then calls the function on the result from the promise 
//in this case, the result is a json object; I am calling this 'data'
d3.json(url).then(function (data) {
  //console log the json data
  console.log(data);
  // iterate over data.names
  for (i=0; i < data.names.length; i++)
  {
    // create select option for each name
    let name = data.names[i]
    //create an option tag within the select with an id of selDataset
    //append an option tag to the select
    //set the text of the option tag to name
    //create an attribute of "value" for the select
    //set the attribute value to name
    // using selection.append(type);
    d3.select("#selDataset").append("option").attr("value", name).text(name)
  }

  //set jsonSamples equal to the json data
  jsonSamples = data.samples
  metaData = data.metadata
  console.log(jsonSamples)

  optionChanged('940')
});


//user selects name
//the name is passed into optionChanged
//see html: onchange="optionChanged(this.value)
//nameValue = the value of the attribute "value" on the option selected
function optionChanged(nameValue) 
{
  console.log('nameValue', nameValue)
  //filter for data.samples where id = nameValue
  //this returns an array of data for the selected name
  selectedSample = jsonSamples.filter(function (jsonSample) { return jsonSample.id === nameValue; })
  console.log('selectedSample', selectedSample)

  //(sort highest to lowest and return top 10)
  otu_ids = selectedSample[0].otu_ids.map(function (id){return "OTU " + id })
  //console.log(otu_ids)
  sample_values = selectedSample[0].sample_values.sort(function(a, b){
    if (a > b) return -1;
    if (a == b) return 0;
    if (a < b) return 1;
  }).slice(0,10)
  console.log('sample_values', sample_values)

  otu_labels = selectedSample[0].otu_labels
  console.log('otu_labels', otu_labels)


  var barData = [
    {
      y: otu_ids,
      x: sample_values,
      type: 'bar',
      orientation: 'h'
    }
  ];
  Plotly.newPlot('bar', barData);

  var bubbleData = [
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers', 
      marker: {size: sample_values, color: otu_ids, colorscale: 'red' }
    }
  ];
  Plotly.newPlot('bubble', bubbleData);

  document.getElementById("sample-metadata").innerHTML = JSON.stringify(
    metaData.find(element => element.id == nameValue)
  )
}
