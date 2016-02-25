
function hex2vec3(val)
{
  var hex = val.substring(1, 7);
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return rgm.vec3((r / 255.0), (g / 255.0), (b / 255.0));
}

function vec32hex(val)
{
  var r = Math.round(val[0] * 255).toString(16);
  var g = Math.round(val[1] * 255).toString(16);
  var b = Math.round(val[2] * 255).toString(16);
  r = r.length == 1 ? "0" + r : r; 
  g = g.length == 1 ? "0" + g : g;
  b = b.length == 1 ? "0" + b : b;
  
  return "#" + r + g + b;
}
