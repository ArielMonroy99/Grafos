
var nodes, edges, network;
var c = [];
function toJSON(obj) {
  return JSON.stringify(obj, null, 4);
}

function addNode() {
  
  try {
    nodes.add({
      id: nodes.get().length+1,
      label: document.getElementById("node-label").value,
    });
  } catch (err) {
    alert(err);
  }
  document.getElementById("node-label").value = "";
  $('#add_node_modal').modal('toggle');
}

function updateNode() {
  try {
    nodes.update({
      id: document.getElementById("node-id").value,
      label: document.getElementById("node-label").value,
    });
  } catch (err) {
    alert(err);
  }
}
function removeNode() {
  try {
    nodes.remove({ id: document.getElementById("node-id").value });
  } catch (err) {
    alert(err);
  }
}

function addEdge() {
  try {
    edges.add({
      id: edges.get().length+1,
      from: c[0],
      to: c[1],
      label:  document.getElementById("edge-label").value,
    });
  } catch (err) {
    alert(err);
  }
  document.getElementById("edge-label").value = "";
  c = [];
  $('#add_edge_modal').modal('toggle');
}
function updateEdge() {
  try {
    edges.update({
      id: document.getElementById("edge-id").value,
      from: document.getElementById("edge-from").value,
      to: document.getElementById("edge-to").value,
    });
  } catch (err) {
    alert(err);
  }
}
function removeEdge() {
  try {
    edges.remove({ id: document.getElementById("edge-id").value });
  } catch (err) {
    alert(err);
  }
}

function draw() {
  // create an array with nodes
  nodes = new vis.DataSet();
  nodes.add([
    { id: "1", label: "Node 1" },
    { id: "2", label: "Node 2" },
    { id: "3", label: "Node 3" },
    { id: "4", label: "Node 4" },
    { id: "5", label: "Node 5" },
  ]);


  // create an array with edges
  edges = new vis.DataSet();
  edges.add([
    { id: "1", from: "1", to: "2" ,label:"5"},
    { id: "2", from: "1", to: "3"  ,label:"5"},
    { id: "3", from: "2", to: "4"  ,label:"5"},
    { id: "4", from: "2", to: "5"  ,label:"5"},
  ]);
 

  // create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
      edges:{
          arrows:{
              to:{
                  enabled: true
              }
          }
      }
  };
  network = new vis.Network(container, data, options);
  network.on('click', function(properties){
        var ids = properties.nodes;
        if(ids[0]!=null){
            c.push(ids[0]);
            console.log(c);
        } 
        else{
            c = [];
            $('#add_node_modal').modal('toggle');
            
        }  
        if(c.length == 2){
            $('#add_edge_modal').modal('show');
        }


  })
}
function matriz (){
    var matrix = llenarMatriz(nodes.get().length);
    var aristas = edges.get();
   aristas.forEach(element => {
        var de = element.from - 1;
        var hacia = element.to - 1;
        var peso = element.label; 
        matrix[de][hacia] = parseInt(peso,10);
    });
    
  return matrix;
}
function llenarMatriz (n){

    var matrix = [];
for(var i=0; i<n+1; i++) {
    matrix[i] = [];
    for(var j=0; j<n+1; j++) {
        matrix[i][j] = 0;
    }
}
return matrix;  
}
function sumas(){
var n = nodes.get().length;
    var matrix = matriz(); 
    var sumlin = [];
    var sumcol  = [];
    var suml = 0; 
    var sumc = 0;
    var sum = 0;

    for(var i=0;i<n;i++){
      suml = 0;
      sumc = 0;
      for(var j=0;j<n;j++){
        suml += matrix[j][i];
        sumc += matrix[i][j];
      }
      sumlin.push(suml);
      sumcol.push(sumc);
    } 
    for(var i=0;i<n;i++){
      matrix[i][n] = sumcol[i];
      sum += sumlin[i];
    }
    matrix[n] = sumlin;
    matrix[n][n] = sum;
    console.log(matrix);
    return matrix;
  }

function construirTabla(){
    var $tabla = document.getElementById("matrix"); 
    $tabla.innerHTML = "";
    var matrix = sumas();
    console.log(matrix);
    var n = nodes.get().length ;
    var nodos = nodes.get();
    var tabla = "<tbody id='body'>\n <tr> \n <th> </th>"; 
    for(var i = 0;i<n;i++){
        tabla += "<th>"+ nodos[i].label +"</th>"
    }
    tabla += "<th> suma </th>\n</tr>\n";
    for(var i = 0;i<n;i++){
        tabla += "<tr> \n"
       
            tabla += "<th>"+ nodos[i].label +"</th>"
       
        for(var j = 0;j<n+1;j++){
            
            tabla += "<td>"+ matrix[i][j] +"</td>"

        }
        tabla += "</tr> \n"
    }
    tabla += "<tr> \n <th> suma </th>"
    for(var i = 0;i<n+1;i++){
        tabla += "<td>"+ matrix[n][i] +"</td>"
    }
    tabla += "</tr> \n <tbody>";
    $('#matrix').append(tabla);

}

