/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/Home_work/Huhuamicao"),
    Sample_area = 
    /* color: #67d6c9 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[121.05844258131694, 30.4311348719198],
          [121.05844258131694, 30.286567247705324],
          [121.25997303785991, 30.286567247705324],
          [121.25997303785991, 30.4311348719198]]], null, false),
    Sample_area02 = 
    /* color: #eeffa6 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[121.0601909862345, 30.380035444996345],
          [121.0601909862345, 30.295587403527687],
          [121.23322565420325, 30.295587403527687],
          [121.23322565420325, 30.380035444996345]]], null, false),
    Huhua1 = /* color: #ff7d7d */ee.Feature(
        ee.Geometry.MultiPolygon(
            [[[[121.12285836313094, 30.36507819689501],
               [121.12423165414657, 30.363967341573],
               [121.12577660653915, 30.364226542276725],
               [121.13002522561874, 30.365004140266084],
               [121.1325572309288, 30.36537442284983],
               [121.13324387643661, 30.366152011712067],
               [121.13444550607528, 30.368188524667435],
               [121.13294346902694, 30.369891757477617],
               [121.13191350076522, 30.369151225118692],
               [121.13195641610946, 30.368077443236196],
               [121.13264306161727, 30.36692959439131],
               [121.13169892404403, 30.367003649562086],
               [121.13092644784774, 30.369299332039166],
               [121.13071187112655, 30.370150942478226],
               [121.12985356424178, 30.369262305330068],
               [121.13028271768417, 30.367522034187292],
               [121.13019688699569, 30.366633373147348],
               [121.12929566476669, 30.367522034187292],
               [121.12813695047225, 30.36763311624945],
               [121.12646325204696, 30.367003649562086],
               [121.1250470456871, 30.366633373147348],
               [121.1248324689659, 30.36618903959891],
               [121.12556202981796, 30.365522535490754],
               [121.12500413034286, 30.365337394654553],
               [121.12350209329452, 30.365892816111643]]],
             [[[121.15371449563827, 30.363996402213346],
               [121.1554311094078, 30.357145850954353],
               [121.15852101419296, 30.357108819643834],
               [121.16281254861678, 30.358997398607872],
               [121.16255505655135, 30.363737200899646],
               [121.16161091897811, 30.365995932113773]]],
             [[[121.21179502885873, 30.375384354790427],
               [121.21226709764535, 30.371274560272155],
               [121.22853201311166, 30.372126153507033],
               [121.22805994432504, 30.375828646551817],
               [121.21784609239633, 30.376865319475435],
               [121.21333998125131, 30.376346984387908]]],
             [[[121.11204189634589, 30.35874357108807],
               [121.11375851011542, 30.35652170393319],
               [121.11538929319647, 30.355669974810386],
               [121.11702007627753, 30.356077324446453],
               [121.11890835142401, 30.36011369734441],
               [121.12126869535712, 30.360891328033585],
               [121.11843628263739, 30.361335685651646],
               [121.11594719267157, 30.360891328033585],
               [121.11431640959051, 30.36000260674129]]],
             [[[121.09419967968641, 30.34255828904019],
               [121.09282638867079, 30.340039752585135],
               [121.09475757916151, 30.340261978996494],
               [121.0953154786366, 30.338706383522958],
               [121.09724666912733, 30.339150841894906],
               [121.10153820355116, 30.340336054354843],
               [121.09660293896376, 30.341669401219953],
               [121.09548714001356, 30.34318791302901]]],
             [[[121.07975460884893, 30.32606886733433],
               [121.08288742897832, 30.326142953430406],
               [121.08559109566534, 30.326846768548364],
               [121.08670689461553, 30.327106067580097],
               [121.08473278878057, 30.328995225519332],
               [121.08267285225713, 30.329069309401874],
               [121.08202912209356, 30.32784691817385],
               [121.0806129157337, 30.326772682984632]]],
             [[[121.14398463342386, 30.370399031431965],
               [121.14449961755471, 30.36699255381575],
               [121.14604456994729, 30.367251746501285],
               [121.14522917840677, 30.37095442413903]]],
             [[[121.15252478692727, 30.369843635570046],
               [121.15394099328714, 30.36640011081193],
               [121.1547993001719, 30.367325801428102],
               [121.15458472345071, 30.370213899828535]]],
             [[[121.17376269868247, 30.381853506092625],
               [121.17303313783042, 30.379891323195267],
               [121.17316188386313, 30.378632543613588],
               [121.17427768281333, 30.37841040435747],
               [121.17427768281333, 30.38152030800013]]],
             [[[121.0642133222134, 30.315742306786998],
               [121.06326918464016, 30.312926696854],
               [121.06640200476956, 30.31263031215502],
               [121.06695990424465, 30.315297742175996]]],
             [[[121.15416301465758, 30.374933145894598],
               [121.15184558606872, 30.373674302461126],
               [121.15175975538024, 30.371823032670683],
               [121.15356219983825, 30.371452774505965],
               [121.15510715223083, 30.37211923819286],
               [121.15545047498473, 30.37426670139026]]]]),
        {
          "class": 1,
          "system:index": "0"
        }),
    Back_ground1 = /* color: #98ff00 */ee.Feature(
        ee.Geometry.MultiPolygon(
            [[[[121.12576466685961, 30.31854713853397],
               [121.12293225413988, 30.314916572445618],
               [121.12576466685961, 30.311804551590754],
               [121.1323736298723, 30.311878648473876],
               [121.13233071452807, 30.31654663916621]]],
             [[[121.15044098979662, 30.320325325904296],
               [121.15185719615648, 30.316768918890734],
               [121.15773659831713, 30.31832486284348],
               [121.15777951366137, 30.321658945252267]]],
             [[[121.13168698436449, 30.34043882261431],
               [121.13520604259203, 30.334883021027938],
               [121.14344578868578, 30.34380918858213],
               [121.13456231242846, 30.345253595614004]]],
             [[[121.10672391173102, 30.304878287363575],
               [121.11311829802253, 30.297504846445293],
               [121.11183083769538, 30.304915338430195],
               [121.10753930327155, 30.307027226080184]]],
             [[[121.20489234873921, 30.363390074862743],
               [121.20570774027973, 30.36153861035862],
               [121.20918388316304, 30.36146455104945],
               [121.21085758158833, 30.364463908215694],
               [121.2039911265102, 30.364278765375335]]],
             [[[121.21483660599992, 30.348269734263866],
               [121.21475077531144, 30.347010547618545],
               [121.2167248811464, 30.347195723141315],
               [121.21702528855607, 30.34823269959379]]],
             [[[121.21705500985142, 30.33669621717719],
               [121.2165829410648, 30.333584888195208],
               [121.22168986702916, 30.333436727206188],
               [121.2220761051273, 30.337548111442256]]],
             [[[121.17606897693815, 30.320523462048524],
               [121.17619772297087, 30.319708465158193],
               [121.1775710139865, 30.32026414559154],
               [121.1773564372653, 30.320782777819083]]],
             [[[121.09820140577087, 30.317231855357225],
               [121.09794391370544, 30.31300847432015],
               [121.1024929401947, 30.31308257029299],
               [121.10644115186462, 30.31574998800357]]],
             [[[121.13098872876891, 30.33234562212434],
               [121.12566722608337, 30.324640855944867],
               [121.13485110975036, 30.323307277191315],
               [121.1346794483734, 30.329382322248836],
               [121.13347781873473, 30.3325678660002]]],
             [[[121.0825956381491, 30.31586621698455],
               [121.08311062227996, 30.312087358280838],
               [121.08645801913055, 30.314013853474965],
               [121.0840547598532, 30.317348082580423]]],
             [[[121.16294757791675, 30.334568119820116],
               [121.1697282023064, 30.33642009466981],
               [121.16028682657398, 30.339753561121253]]]]),
        {
          "system:index": "0",
          "class": 0
        }),
    Huhua2 = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Feature(
        ee.Geometry.MultiPolygon(
            [[[[121.027662763565, 30.27919603716888],
               [121.02697611805719, 30.279084854776073],
               [121.02680445668024, 30.27834363560486],
               [121.02689028736872, 30.277787717552425],
               [121.02864981648248, 30.278380696696384]]],
             [[[121.03212595936579, 30.283420874750334],
               [121.03122473713678, 30.282197914157635],
               [121.03178263661188, 30.28056727632265],
               [121.03410006520075, 30.282494390852577]]],
             [[[121.04100943562311, 30.290980656384153],
               [121.03937865254206, 30.290535979473724],
               [121.03907824513239, 30.289090765592324],
               [121.03937865254206, 30.288979594411785],
               [121.04199648854059, 30.289720733235445]]],
             [[[121.0481762981109, 30.29776172946716],
               [121.04482890126032, 30.29557553307606],
               [121.04594470021051, 30.29446388910097],
               [121.04972125050348, 30.296353676361115],
               [121.05216742512506, 30.297428245032382]]],
             [[[121.03598105842661, 30.28542677819675],
               [121.03430736000132, 30.284537372006938],
               [121.03598105842661, 30.283351484545005],
               [121.03838431770396, 30.284685606931816]]],
             [[[121.02512787693286, 30.276248591686702],
               [121.02547119968676, 30.275803848002614],
               [121.02645825260424, 30.276248591686702],
               [121.0271878134563, 30.276915703434007],
               [121.02624367588305, 30.27817579102872]]],
             [[[121.04234464047241, 30.292473902073528],
               [121.0420013177185, 30.292066287854983],
               [121.04221589443969, 30.291362222942066],
               [121.04427583096313, 30.29180689610664],
               [121.04504830715942, 30.292918570198072],
               [121.04268796322631, 30.29254801356761],
               [121.04238755581665, 30.293659679258912]]]]),
        {
          "class": 1,
          "system:index": "0"
        }),
    Back_ground2 = 
    /* color: #0b4a8b */
    /* shown: false */
    ee.Feature(
        ee.Geometry.MultiPolygon(
            [[[[120.91710445842853, 30.25092987735131],
               [120.90165493450274, 30.242032327174297],
               [120.91332790813556, 30.23224409150842],
               [120.95109341106524, 30.235210326455864]]],
             [[[121.01598141155353, 30.248260696895425],
               [120.9874856229793, 30.236693410367433],
               [121.00842831096759, 30.231354203572508],
               [121.03898403606524, 30.233430596227066]]],
             [[[120.97306606731524, 30.227794571286534],
               [120.95761654338946, 30.22215822329887],
               [120.98782894573321, 30.221564904719955]]],
             [[[121.0527169462215, 30.233430596227066],
               [121.03726742229571, 30.22334484971945],
               [121.05649349651446, 30.220971582561997],
               [121.06507656536212, 30.225718059610433]]],
             [[[121.04585049114337, 30.259530076614706],
               [121.03452084026446, 30.25092987735131],
               [121.06301662883868, 30.254192110538817]]]]),
        {
          "class": 0,
          "system:index": "0"
        }),
    Yuyao = ee.FeatureCollection("projects/ee-glj320104/assets/CITY/Yuyao");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

// ------------------------------------the part of outcloud------------------------------------------
// ******(function)use QA to outcloud
function OutCloudQA(image) { 
  var qa = image.select('QA60'); 
  var cloudBitMask = 1 << 10; 
  var cirrusBitMask = 1 << 11; 
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0) 
              .and(qa.bitwiseAnd(cirrusBitMask).eq(0)); 
  return image.updateMask(mask); 
}

// ******(function)use NDSI to outcloud
var _cloudScore = function(img) { 
  var rescale = function(img, exp, thresholds) { 
    return img.expression(exp, {img: img}) 
        .subtract(thresholds[0]).divide(thresholds[1] - thresholds[0]); 
  }; 
  var score = ee.Image.constant(1.0); 
  score = score.min(rescale(img, 'img.blue', [0.1, 0.3])); 
  score = score.min(rescale(img, 'img.red + img.green + img.blue', [0.2, 0.8])); 
  score = score.min(rescale(img, 'img.nir + img.swir1 + img.swir2', [0.3, 0.8])); 
  var ndsi = img.normalizedDifference(['green', 'swir1']); 
  return score.min(rescale(ndsi, 'img', [0.8, 0.6])); 
}; 
// remove cloud by Score bands 
function rmCloudByScore(image, thread) { 
  var preBands = ["B2","B3","B4","B8","B11","B12"]; 
  var newBands = ['blue','green','red','nir','swir1','swir2']; 
  var score = _cloudScore(image.select(preBands, newBands)); 
  score = score.multiply(100).byte().rename('cloud'); 
  return image.addBands(score) 
              .updateMask(score.lte(thread)); 
} 
// scale the image 
function scaleImage(image) { 
  var time_start = image.get("system:time_start");
  image = image.divide(10000); 
  image = image.set("system:time_start", time_start); 
  return image; 
}

// ******(function)select
function sele_band(img){
  var img_sel = img.select("B1","B2","B3","B4","B5","B6","B7","B8","B8A","B9","B11","B12");
  return img_sel;
}

// ------------------------------------------Calculate the exponents(NDVI)------------------------------------------
function NDVI_cal(img){
  var NDVI = img.normalizedDifference(["B8","B4"]).rename("NDVI");
  var NDVIre1 = img.normalizedDifference(["B8","B5"]).rename("NDVIre1");
  var NDVIre2 = img.normalizedDifference(["B8","B6"]).rename("NDVIre2");
  var NDVIre3 = img.normalizedDifference(["B8","B7"]).rename("NDVIre3");
  var NDVIre4 = img.normalizedDifference(["B8","B8A"]).rename("NDVIre4");
  var final_img = img.addBands(NDVI).addBands(NDVIre1).addBands(NDVIre2).addBands(NDVIre3).addBands(NDVIre4);
  return final_img;
}


// -------------------------------------------Calculate the exponents(ND)-------------------------------------------
function ND_cal(img){
  var NDre1 = img.normalizedDifference(["B8","B5"]).rename("NDre1");
  var NDre2 = img.normalizedDifference(["B8","B6"]).rename("NDre2");
  var NDre3 = img.normalizedDifference(["B8","B7"]).rename("NDre3");
  var NDre4 = img.normalizedDifference(["B8","B8A"]).rename("NDre4");
  var final_img = img.addBands(NDre1).addBands(NDre2).addBands(NDre3).addBands(NDre4);
  return final_img;
}


// -------------------------------------------Calculate the exponents(NDWI)------------------------------------------
function NDWI_cal(img){
  var NDWI = img.normalizedDifference(['B3','B8']).rename("NDWI");
  var MNDWIre1 = img.normalizedDifference(['B3','B11']).rename("MNDWIre1");
  var MNDWIre2 = img.normalizedDifference(['B3','B12']).rename("MNDWIre2");
  var final_img = img.addBands(NDWI).addBands(MNDWIre1).addBands(MNDWIre2);
  return final_img;
}

// --------------------------------------------calculate the exponents(LSWI)----------------------------------------
function LSWIre_cal(img){
  var LSWIre1 = img.normalizedDifference(['B8','B11']).rename("LSWIre1");
  var LSWIre2 = img.normalizedDifference(['B8','B12']).rename("LSWIre2");
  var final_img = img.addBands(LSWIre1).addBands(LSWIre2);
  return final_img;
}

// ---------------------------------------------calculate the exponents(Clre)----------------------------------------
function Clre(img){
  var Clre1 = img.select("B8").divide(img.select("B5")).subtract(1).rename("Clre1");
  var Clre2 = img.select("B8").divide(img.select("B6")).subtract(1).rename("Clre2");
  var Clre3 = img.select("B8").divide(img.select("B7")).subtract(1).rename("Clre3");
  var Clre4 = img.select("B8").divide(img.select("B8A")).subtract(1).rename("Clre4");
  var final_img = img.addBands(Clre1).addBands(Clre2).addBands(Clre3).addBands(Clre4);
  return final_img;
}


// ******(function)calculate the RVI
function RVI_cal(img){
  var RVI = img.select("B8").divide(img.select("B4")).rename("RVI");
  var DVI = img.select("B8").subtract(img.select("B4")).rename("DVI");
  var GI = img.select("B3").divide(img.select("B4")).rename("GI");
  var final_img = img.addBands(RVI).addBands(DVI).addBands(GI);
  return final_img;
}

// ******(function)calculate the EVI
function EVI_cal(img){
  var son = img.select("B8").subtract(img.select("B4"));
  var mon = img.select("B4").multiply(6.0).subtract(img.select("B2").multiply(7.5)).add(img.select("B8")).add(1); 
  var EVI = son.divide(mon).multiply(2.5).rename("EVI");
  var final_img = img.addBands(EVI);
  return final_img;
}

//------------------------------------function as the two img----------------------------------
// calculate the Psw(8-12/8)
function PSW(imgs,imgw){
  // img1 is the summer,img2 is the winter
  var NDVIs = imgs.select("NDVI");
  var NDVIw = imgw.select("NDVI");
  var psw = (NDVIs.subtract(NDVIw)).divide(NDVIs);
  var final_img = imgs.addBands(psw.rename("Psw"));
  return final_img;
}






// ------------------------------------------ROI-----------------------------------------------
var ROI = table;
Map.addLayer(ROI,{},"ALL_ROI",0);
// print(ROI);


// var roi = ROI.filter(ee.Filter.eq("XIAN_NAME","镇海区"));
// Map.centerObject(roi,12);
// Map.addLayer(roi,{},"ZhenHai_ROI");
// print(roi);

// select the CiXi
var CiXi_ROI = ROI.filter(ee.Filter.eq("XIAN_NAME","慈溪市"));
Map.addLayer(CiXi_ROI,{},"CiXi_ROI",0);

// // 取交集
// var roi = CiXi_ROI.geometry().intersection(Sample_area, ee.ErrorMargin(1));


// ************************************************************************************************************************
// 设置边框和填充样式
var styleParams = {
  color: 'red', // 边框颜色
  fillColor: 'black', // 填充颜色
  width: 2 // 边框宽度
};

var roi = CiXi_ROI.geometry();
Map.centerObject(roi,12);
Map.addLayer(roi, styleParams, 'roi');




// ----------------------------------------collect the data------------------------------------
var Sen_imgc = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
var Sen_sarc = ee.ImageCollection("COPERNICUS/S1_GRD");
var DEMc = ee.ImageCollection("COPERNICUS/DEM/GLO30");










// --------------------------------------------Pre--------------------------------------------
// ++++++filter the data(2022year )
var Sen_c1 = Sen_imgc.filterDate("2023-01-01","2023-11-01")
                    .filterBounds(roi);
                     
// print("The size of the Sen_c1:",Sen_c1.size());
// ++++++out cloud,to control the cloud piexl
var cloud_thresholds = 45;

var Sen_c2 = Sen_c1.map(sele_band)
                  .map(scaleImage)
                  .map(function(image) {return rmCloudByScore(image, cloud_thresholds);})
                  .map(NDVI_cal)
                  .map(ND_cal)
                  .map(NDWI_cal)
                  .map(LSWIre_cal) 
                  .map(Clre) 
                  .map(RVI_cal)
                  .map(EVI_cal); 
                   
                   
var img_4 = Sen_c2.filterDate("2023-06-01","2023-07-30").median().clip(roi);
var img_10 = Sen_c2.filterDate("2023-10-01","2023-10-31").median().clip(roi);
            
            
var visParams_true = {min:0,max:0.2,bands:["B4","B3","B2"]};
var visParams_CIR = {min:0,max:0.2,bands:["B8","B4","B3"]};


Map.addLayer(img_4,visParams_true,"img_4_true",0);
Map.addLayer(img_10,visParams_true,"img_10_true",0);
Map.addLayer(img_4,visParams_CIR,"img_4_CIR",0);
Map.addLayer(img_10,visParams_CIR,"img_10_CIR",0);


// copy the 4 month img as the sample
var sam_img = img_4;
var sam_img = PSW(sam_img,img_10);


print("1",img_4.bandNames());





// ----------------------------------------topographical-----------------------------
// calculate the Terrian
var DEM = DEMc.filterBounds(roi).mosaic().select("DEM").clip(roi);
var terrain = ee.Algorithms.Terrain(DEM).select("slope","aspect","hillshade");
sam_img = sam_img.addBands(DEM).addBands(terrain);

// --------------------------------------------grain---------------------------------------
var glcm_sam = Sen_imgc.filterDate("2023-06-01","2023-07-30")
                    .filterBounds(roi)
                    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',30))
                    .mosaic()
                    .clip(roi)
                    .select("B1","B2","B3","B4","B5","B6","B7","B8","B8A","B9","B11","B12");
                     
                     
                    
// print(glcm_sam);
                     
Map.addLayer(glcm_sam,{min:0,max:5000,bands:["B4","B3","B2"]},"glcm_sam");
var glcm_B = glcm_sam.glcmTexture();
sam_img = sam_img.addBands(glcm_B);

print("2",sam_img.bandNames());









// --------------------------------------Sentinel-1 SAR---------------------------------
var sar_4 = Sen_sarc.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
                    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
                    .filterBounds(roi)
                    .filterMetadata('instrumentMode','equals','IW')
                    .filterDate('2023-06-01', '2023-07-30')
                    .median()
                    .clip(roi)
                    .select("VV","VH");

sam_img = sam_img.addBands(sar_4);
print("Band_Names:",sam_img.bandNames());

// remove the cloud bands
var bandlist = sam_img.bandNames();
bandlist = bandlist.filter(ee.Filter.neq('item', "cloud"));
print("Band_Names_filter:",bandlist);
sam_img = sam_img.select(bandlist);
print(sam_img.bandNames());
print(sam_img);




// using unmask to mask the all nodata

sam_img = sam_img.unmask(ee.Image(0));
Map.addLayer(sam_img,visParams_true,"sam_img");

// // -------------------------------------------RF-----------------------------------------------

// // --------------------------------------prepare the data-----------------------------------------
// // merge the dataset

// // // quick create and rename the band 
// // var band_img = ee.Image(0);
// // for(var i = 1;i <= 256;i++){
// //   var band_sub = ee.Image(0).rename("B"+i);
// //   band_img = band_img.addBands(band_sub);
// // }
// // var band_img_name_l = band_img.bandNames();
// // band_img = band_img.select(band_img_name_l).rename(bandlist);


// polygon to points 注意波段数量多的影像不适合sampleRegions
var polygon =ee.FeatureCollection([Huhua1,Back_ground1]);
print(polygon);
var points = sam_img.sampleRegions({
  collection: polygon,
  properties: ['class'],
  scale: 20,
  tileScale:4,
});

// //分类样本
// var train_points = Huhua.merge(Back_ground);
// var points = sam_img.sampleRegions({
//   collection: train_points,
//   properties: ['class'],
//   scale: 10,
//   tileScale:4
// });

// print(points);
print("样本点总量:",points.size());

// 以下就是纯粹为了选取XXX个点的数据进行训练模型，XXX个点数据进行验证模型
// 备注：有一个bug,如果点的数据少于输入的数据，那这个函数就没有意义了
var split = function(data,number){
  var tr = data.randomColumn('random', 555) ;
  var train = ee.FeatureCollection([]);
  var test = ee.FeatureCollection([]);
  for(var i = 0;i<=1;i++){
    var cate = tr.filter(ee.Filter.eq("class",i)).limit(number,"random");
    var cate_tr = cate.limit(number*0.7,"random",false);
    var cate_test = cate.limit(number*0.3,"random",true);
    train = train.merge(cate_tr);
    test = test.merge(cate_test);
  }
  return [train,test];
};

var train_test = split(points,3000);

var trainingPartition = train_test[0];
var testingPartition = train_test[1];

print("训练集数量:",trainingPartition.size());
print("测试集数量:",testingPartition.size());

// 统计每类有多少个数据
var figure_histogram = function(points){
                        var histogram = ui.Chart.feature.histogram({
                        features: points,
                        property: "class",
                        minBucketWidth:1, 
                        maxBuckets:3,
                        }).setOptions({
                            legend: {'position': 'none' },
                            title: 'counts of different categories',
                            hAxis: {'title': 'categories'},
                            vAxis: {'title': 'counts'},
                        });
                        print(histogram);
                        return histogram;
};

// 训练数据， 验证数据出图
figure_histogram(trainingPartition);
figure_histogram(testingPartition);























// // -----------------------------------------使用RF进行分类-----------------------------------------

// //分类方法选择随机森林

// var inputbands = bandlist;

// var rf = ee.Classifier.smileRandomForest({
//   numberOfTrees: 20,  
//   bagFraction: 0.8
// }).train({
//   features: trainingPartition,
//   classProperty: 'class',
//   inputProperties: inputbands
// });
// //对哨兵数据进行随机森林分类
// var img_classfication = sam_img.classify(rf); 
// //运用测试样本分类，确定要进行函数运算的数据集以及函数
// var test = testingPartition.classify(rf);
// //计算混淆矩阵
// var confusionMatrix = test.errorMatrix('class', 'classification');
// print('confusionMatrix',confusionMatrix);//面板上显示混淆矩阵
// print('overall accuracy', confusionMatrix.accuracy());//面板上显示总体精度
// print('kappa accuracy', confusionMatrix.kappa());//面板上显示kappa值
// // Map.addLayer(img_classfication.clip(roi), {min: 6, max: 7, palette: ['blue', 'silver', 'green','brown','red','black']},"classification");
// Map.addLayer(img_classfication, {min: 0, max: 1, palette: ['#BDC0BA','#1B813E']},"classification",0);

// // Export the classification
// Export.image.toDrive({
//     image:img_classfication, 
//     description:'Huhuamicao', //文件名
//     region:roi,
//     scale: 10,                      //分辨率
//     maxPixels:1e13                //此处值设置大一些，防止溢出
//     });
    
    
// //  calculate the area of the huhaumicao 
// // create the dict
// var out_dict = ee.Dictionary({});

// var huahu_area = img_classfication.updateMask(img_classfication.eq(1)).reduceRegion({
//     reducer: ee.Reducer.count(),
//     geometry: roi,
//     scale: 10,
//     maxPixels: 10e15,
// }).get('constant');

// out_dict = out_dict.set("huhua",huahu_area);

// var all_area = img_classfication.reduceRegion({
//     reducer: ee.Reducer.count(),
//     geometry: roi,
//     scale: 10,
//     maxPixels: 10e15,
// }).get('constant');

// out_dict = out_dict.set("all",all_area);


// // 将字典转换为特征对象
// var feature = ee.Feature(null, out_dict);

// // 创建包含特征的特征集合
// var featureCollection = ee.FeatureCollection([feature]);

// // 导出特征集合作为CSV文件到Google Drive
// Export.table.toDrive({
//   collection: featureCollection,
//   description: 'chart',       
//   fileFormat: 'CSV'
// });