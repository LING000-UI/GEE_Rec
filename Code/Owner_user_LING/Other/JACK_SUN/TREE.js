
/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Sen = ee.ImageCollection("COPERNICUS/S2_SR"),
    nj = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[118.2444902655106, 32.62551807230179],
          [118.2444902655106, 31.147028012001684],
          [119.49418508972936, 31.147028012001684],
          [119.49418508972936, 32.62551807230179]]], null, false),
    njp = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj"),
    luodi = /* color: #d4d64d */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([118.6089964312759, 31.88290119698401]),
            {
              "landcover": 0,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([118.61174301330715, 31.881735087892714]),
            {
              "landcover": 0,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([118.62496093933254, 31.900973999950647]),
            {
              "landcover": 0,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([118.6280508441177, 31.904763008736758]),
            {
              "landcover": 0,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([118.62667755310207, 31.91000907107299]),
            {
              "landcover": 0,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([118.62959579651027, 31.92020889164638]),
            {
              "landcover": 0,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([118.59492019836574, 31.85557443957808]),
            {
              "landcover": 0,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([118.58771042053371, 31.855137020717585]),
            {
              "landcover": 0,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([118.58925537292629, 31.84842967169694]),
            {
              "landcover": 0,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([118.6203260821548, 31.853824751686147]),
            {
              "landcover": 0,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([118.62358764831691, 31.854699599782066]),
            {
              "landcover": 0,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Point([118.73466125144016, 31.862547072049868]),
            {
              "landcover": 0,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Point([118.72848144186985, 31.8632760437395]),
            {
              "landcover": 0,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Point([118.74702087058078, 31.878728886898674]),
            {
              "landcover": 0,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Point([118.7399827541257, 31.88004080140073]),
            {
              "landcover": 0,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Point([118.7606032026575, 31.904238564520075]),
            {
              "landcover": 0,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Point([118.75896068324462, 31.917790357786057]),
            {
              "landcover": 0,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Point([118.74934764613525, 31.915167585835192]),
            {
              "landcover": 0,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Point([118.76007648219482, 31.916770399802033]),
            {
              "landcover": 0,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8034276003465, 31.931388446518522]),
            {
              "landcover": 0,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Point([118.77510347314923, 31.937070022288502]),
            {
              "landcover": 0,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Point([118.77793588586896, 31.94901475411228]),
            {
              "landcover": 0,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Point([118.79003801294415, 31.948941925086473]),
            {
              "landcover": 0,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Point([118.7971619600877, 31.95826357112243]),
            {
              "landcover": 0,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Point([118.77493181177228, 31.95629736513639]),
            {
              "landcover": 0,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Point([118.77167024561017, 31.95855485731824]),
            {
              "landcover": 0,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Point([118.75355997034161, 31.940129186866315]),
            {
              "landcover": 0,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Point([118.75484743066876, 31.951636560591723]),
            {
              "landcover": 0,
              "system:index": "27"
            }),
        ee.Feature(
            ee.Geometry.Point([118.75810899683087, 31.95462241572608]),
            {
              "landcover": 0,
              "system:index": "28"
            }),
        ee.Feature(
            ee.Geometry.Point([118.73871126123517, 31.949670212746682]),
            {
              "landcover": 0,
              "system:index": "29"
            }),
        ee.Feature(
            ee.Geometry.Point([118.77167024561017, 31.939036639777154]),
            {
              "landcover": 0,
              "system:index": "30"
            }),
        ee.Feature(
            ee.Geometry.Point([118.78480234094708, 31.939036639777154]),
            {
              "landcover": 0,
              "system:index": "31"
            }),
        ee.Feature(
            ee.Geometry.Point([118.78480234094708, 31.945955885321858]),
            {
              "landcover": 0,
              "system:index": "32"
            }),
        ee.Feature(
            ee.Geometry.Point([118.84239473291485, 31.93444780018275]),
            {
              "landcover": 0,
              "system:index": "33"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8404206270799, 31.956443011467737]),
            {
              "landcover": 0,
              "system:index": "34"
            }),
        ee.Feature(
            ee.Geometry.Point([118.83844652124493, 31.955059361995136]),
            {
              "landcover": 0,
              "system:index": "35"
            }),
        ee.Feature(
            ee.Geometry.Point([118.84585064306123, 31.959394378512485]),
            {
              "landcover": 0,
              "system:index": "36"
            }),
        ee.Feature(
            ee.Geometry.Point([118.85623615636689, 31.944756237865565]),
            {
              "landcover": 0,
              "system:index": "37"
            }),
        ee.Feature(
            ee.Geometry.Point([118.85419767751557, 31.945539182534237]),
            {
              "landcover": 0,
              "system:index": "38"
            }),
        ee.Feature(
            ee.Geometry.Point([118.88325786497965, 31.96045789614914]),
            {
              "landcover": 0,
              "system:index": "39"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8790521612443, 31.962496831399097]),
            {
              "landcover": 0,
              "system:index": "40"
            }),
        ee.Feature(
            ee.Geometry.Point([118.50797278684769, 32.024927800854364]),
            {
              "landcover": 0,
              "system:index": "41"
            }),
        ee.Feature(
            ee.Geometry.Point([118.45029456419144, 32.020852659850064]),
            {
              "landcover": 0,
              "system:index": "42"
            }),
        ee.Feature(
            ee.Geometry.Point([118.44686133665238, 32.01095513419481]),
            {
              "landcover": 0,
              "system:index": "43"
            }),
        ee.Feature(
            ee.Geometry.Point([118.45441443723831, 32.0905379554874]),
            {
              "landcover": 0,
              "system:index": "44"
            }),
        ee.Feature(
            ee.Geometry.Point([118.84669756728174, 31.79585567135454]),
            {
              "landcover": 0,
              "system:index": "45"
            }),
        ee.Feature(
            ee.Geometry.Point([118.73134112196924, 31.80315039807275]),
            {
              "landcover": 0,
              "system:index": "46"
            }),
        ee.Feature(
            ee.Geometry.Point([118.73374438124658, 31.797606458282367]),
            {
              "landcover": 0,
              "system:index": "47"
            }),
        ee.Feature(
            ee.Geometry.Point([118.85184740859033, 31.738645066653504]),
            {
              "landcover": 0,
              "system:index": "48"
            }),
        ee.Feature(
            ee.Geometry.Point([118.86764025527002, 31.73222126049238]),
            {
              "landcover": 0,
              "system:index": "49"
            }),
        ee.Feature(
            ee.Geometry.Point([118.84065067896735, 31.729138359580777]),
            {
              "landcover": 0,
              "system:index": "50"
            }),
        ee.Feature(
            ee.Geometry.Point([118.84494221339118, 31.72811631534708]),
            {
              "landcover": 0,
              "system:index": "51"
            }),
        ee.Feature(
            ee.Geometry.Point([118.86228001246344, 31.73541638398875]),
            {
              "landcover": 0,
              "system:index": "52"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8133565200318, 31.760962094111388]),
            {
              "landcover": 0,
              "system:index": "53"
            }),
        ee.Feature(
            ee.Geometry.Point([118.71181881556403, 31.76139995912168]),
            {
              "landcover": 0,
              "system:index": "54"
            }),
        ee.Feature(
            ee.Geometry.Point([118.71602451929938, 31.759356571350015]),
            {
              "landcover": 0,
              "system:index": "55"
            }),
        ee.Feature(
            ee.Geometry.Point([118.69525349268805, 31.734540406120498]),
            {
              "landcover": 0,
              "system:index": "56"
            }),
        ee.Feature(
            ee.Geometry.Point([118.70108997950446, 31.756583330072402]),
            {
              "landcover": 0,
              "system:index": "57"
            }),
        ee.Feature(
            ee.Geometry.Point([118.61543095240485, 31.77147028255602]),
            {
              "landcover": 0,
              "system:index": "58"
            }),
        ee.Feature(
            ee.Geometry.Point([118.61955082545173, 31.79758963432783]),
            {
              "landcover": 0,
              "system:index": "59"
            })]),
    grass = /* color: #98ff00 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([118.54029643707923, 32.10786876384011]),
            {
              "landcover": 1,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([118.53975999527626, 32.109213755606724]),
            {
              "landcover": 1,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([118.53956687622718, 32.11184915500046]),
            {
              "landcover": 1,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([118.52270114594154, 32.110249749270295]),
            {
              "landcover": 1,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([118.48067581280313, 32.1074457759676]),
            {
              "landcover": 1,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([118.48359405621133, 32.10911793264421]),
            {
              "landcover": 1,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([118.48925888165078, 32.101774755746845]),
            {
              "landcover": 1,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([118.48985969647012, 32.10119309273538]),
            {
              "landcover": 1,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([118.50711166485391, 32.11762364682709]),
            {
              "landcover": 1,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([118.50436508282266, 32.117696341823134]),
            {
              "landcover": 1,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([118.58029630357309, 32.086552431404556]),
            {
              "landcover": 1,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Point([118.57892301255747, 32.0854616284845]),
            {
              "landcover": 1,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Point([118.55325963670298, 32.08407992609515]),
            {
              "landcover": 1,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Point([118.55231549912973, 32.083061816231]),
            {
              "landcover": 1,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Point([118.48927347947348, 31.987773168724093]),
            {
              "landcover": 1,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Point([118.51802676011313, 32.01805224379308]),
            {
              "landcover": 1,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Point([118.54060023118247, 32.003350672653156]),
            {
              "landcover": 1,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Point([118.53630869675864, 31.994397570848193]),
            {
              "landcover": 1,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Point([118.46618502427329, 31.998619467608055]),
            {
              "landcover": 1,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Point([118.47253649522055, 31.998182728680913]),
            {
              "landcover": 1,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Point([118.512402675354, 31.97663669430356]),
            {
              "landcover": 1,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Point([118.51291765948486, 31.976054235715377]),
            {
              "landcover": 1,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Point([118.44742886416913, 31.957428954621584]),
            {
              "landcover": 1,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Point([118.44528309695721, 31.9595407778014]),
            {
              "landcover": 1,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Point([118.46605412356854, 31.960705900837702]),
            {
              "landcover": 1,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Point([118.46871487491131, 31.960487441394392]),
            {
              "landcover": 1,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Point([118.50768200747967, 31.948981176325717]),
            {
              "landcover": 1,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Point([118.52716557376385, 31.956190966732798]),
            {
              "landcover": 1,
              "system:index": "27"
            }),
        ee.Feature(
            ee.Geometry.Point([118.50791219113913, 31.892854814783927]),
            {
              "landcover": 1,
              "system:index": "28"
            }),
        ee.Feature(
            ee.Geometry.Point([118.48662618039694, 31.88352653687038]),
            {
              "landcover": 1,
              "system:index": "29"
            }),
        ee.Feature(
            ee.Geometry.Point([118.48147633908835, 31.889065315841187]),
            {
              "landcover": 1,
              "system:index": "30"
            }),
        ee.Feature(
            ee.Geometry.Point([118.54868994833903, 31.839058484798077]),
            {
              "landcover": 1,
              "system:index": "31"
            }),
        ee.Feature(
            ee.Geometry.Point([118.54645835043864, 31.837308483591684]),
            {
              "landcover": 1,
              "system:index": "32"
            }),
        ee.Feature(
            ee.Geometry.Point([118.56276618124919, 31.868949211210914]),
            {
              "landcover": 1,
              "system:index": "33"
            }),
        ee.Feature(
            ee.Geometry.Point([118.53203879477458, 31.864721355388053]),
            {
              "landcover": 1,
              "system:index": "34"
            }),
        ee.Feature(
            ee.Geometry.Point([118.73029344088023, 31.8424338692372]),
            {
              "landcover": 1,
              "system:index": "35"
            }),
        ee.Feature(
            ee.Geometry.Point([118.85401080582645, 31.837898185149488]),
            {
              "landcover": 1,
              "system:index": "36"
            }),
        ee.Feature(
            ee.Geometry.Point([118.86066268418338, 31.84522604685118]),
            {
              "landcover": 1,
              "system:index": "37"
            }),
        ee.Feature(
            ee.Geometry.Point([118.85375331376102, 31.845408324548725]),
            {
              "landcover": 1,
              "system:index": "38"
            }),
        ee.Feature(
            ee.Geometry.Point([118.84414027665164, 31.828199722205227]),
            {
              "landcover": 1,
              "system:index": "39"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95087987055926, 32.40007116664893]),
            {
              "landcover": 1,
              "system:index": "40"
            }),
        ee.Feature(
            ee.Geometry.Point([118.94909888377337, 32.40094079274091]),
            {
              "landcover": 1,
              "system:index": "41"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95066529383807, 32.4030785879424]),
            {
              "landcover": 1,
              "system:index": "42"
            }),
        ee.Feature(
            ee.Geometry.Point([118.96859960061104, 32.40569731313777]),
            {
              "landcover": 1,
              "system:index": "43"
            }),
        ee.Feature(
            ee.Geometry.Point([118.85114266601748, 32.525719666872476]),
            {
              "landcover": 1,
              "system:index": "44"
            }),
        ee.Feature(
            ee.Geometry.Point([118.85483338562197, 32.526370977948666]),
            {
              "landcover": 1,
              "system:index": "45"
            }),
        ee.Feature(
            ee.Geometry.Point([118.7645465823134, 32.5321199548332]),
            {
              "landcover": 1,
              "system:index": "46"
            }),
        ee.Feature(
            ee.Geometry.Point([118.7700397463759, 32.521626706449624]),
            {
              "landcover": 1,
              "system:index": "47"
            }),
        ee.Feature(
            ee.Geometry.Point([118.77355880460344, 32.523653084374345]),
            {
              "landcover": 1,
              "system:index": "48"
            }),
        ee.Feature(
            ee.Geometry.Point([118.73843816026185, 32.56433527694186]),
            {
              "landcover": 1,
              "system:index": "49"
            }),
        ee.Feature(
            ee.Geometry.Point([118.77148297532533, 32.55681190936699]),
            {
              "landcover": 1,
              "system:index": "50"
            }),
        ee.Feature(
            ee.Geometry.Point([118.78332761033509, 32.57048371463325]),
            {
              "landcover": 1,
              "system:index": "51"
            }),
        ee.Feature(
            ee.Geometry.Point([118.80092290147279, 32.56708404235029]),
            {
              "landcover": 1,
              "system:index": "52"
            }),
        ee.Feature(
            ee.Geometry.Point([118.70690329176148, 32.59133963836008]),
            {
              "landcover": 1,
              "system:index": "53"
            }),
        ee.Feature(
            ee.Geometry.Point([118.70604498487671, 32.59394294984095]),
            {
              "landcover": 1,
              "system:index": "54"
            }),
        ee.Feature(
            ee.Geometry.Point([118.68249184939341, 32.56051631844903]),
            {
              "landcover": 1,
              "system:index": "55"
            }),
        ee.Feature(
            ee.Geometry.Point([118.68429429385142, 32.56066099857058]),
            {
              "landcover": 1,
              "system:index": "56"
            }),
        ee.Feature(
            ee.Geometry.Point([118.66112000796275, 32.565362975521246]),
            {
              "landcover": 1,
              "system:index": "57"
            }),
        ee.Feature(
            ee.Geometry.Point([118.61006368257188, 32.58894759726984]),
            {
              "landcover": 1,
              "system:index": "58"
            }),
        ee.Feature(
            ee.Geometry.Point([118.85527927913368, 32.23266371221232]),
            {
              "landcover": 1,
              "system:index": "59"
            })]),
    LY = /* color: #0b4a8b */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([118.82405775652086, 32.46271116460419]),
            {
              "landcover": 2,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8209678517357, 32.46292842094172]),
            {
              "landcover": 2,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([118.83092421159898, 32.46864931588477]),
            {
              "landcover": 2,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([118.64902502020166, 32.55971098905191]),
            {
              "landcover": 2,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([118.6675644489126, 32.569548794164334]),
            {
              "landcover": 2,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([118.64421850164698, 32.59240305764149]),
            {
              "landcover": 2,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([118.59134679754541, 32.58979970142775]),
            {
              "landcover": 2,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([118.67031103094385, 32.569838125041734]),
            {
              "landcover": 2,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([118.6924553485708, 32.552766006552176]),
            {
              "landcover": 2,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([118.695373591979, 32.552910699169416]),
            {
              "landcover": 2,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([118.70035177191065, 32.59659719469362]),
            {
              "landcover": 2,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Point([118.695373591979, 32.59760954319166]),
            {
              "landcover": 2,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Point([118.74258047064112, 32.56260457312891]),
            {
              "landcover": 2,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Point([118.74652868231104, 32.565208719010684]),
            {
              "landcover": 2,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Point([118.85782550814912, 32.53213738792166]),
            {
              "landcover": 2,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Point([118.86297534945771, 32.52938755221277]),
            {
              "landcover": 2,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Point([118.87207340243623, 32.535321303050786]),
            {
              "landcover": 2,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Point([118.92065357211396, 32.548055834849656]),
            {
              "landcover": 2,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Point([118.92031024936006, 32.54588530371017]),
            {
              "landcover": 2,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Point([118.94668376589028, 32.539889502330475]),
            {
              "landcover": 2,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95269191408364, 32.50906023987844]),
            {
              "landcover": 2,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95938670778482, 32.5039933868585]),
            {
              "landcover": 2,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Point([118.94410884523599, 32.50573062577378]),
            {
              "landcover": 2,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Point([118.83093315399238, 32.462594282436555]),
            {
              "landcover": 2,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8268132809455, 32.45651088432708]),
            {
              "landcover": 2,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Point([118.86179269689802, 32.39523681727046]),
            {
              "landcover": 2,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Point([118.86436761755232, 32.39451208365996]),
            {
              "landcover": 2,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Point([118.91037286657576, 32.39030851402063]),
            {
              "landcover": 2,
              "system:index": "27"
            }),
        ee.Feature(
            ee.Geometry.Point([118.9237624539781, 32.38682954980621]),
            {
              "landcover": 2,
              "system:index": "28"
            }),
        ee.Feature(
            ee.Geometry.Point([118.94243744861221, 32.3515438473309]),
            {
              "landcover": 2,
              "system:index": "29"
            }),
        ee.Feature(
            ee.Geometry.Point([118.93711594592666, 32.3511087975876]),
            {
              "landcover": 2,
              "system:index": "30"
            }),
        ee.Feature(
            ee.Geometry.Point([118.89144493427088, 32.30684478597098]),
            {
              "landcover": 2,
              "system:index": "31"
            }),
        ee.Feature(
            ee.Geometry.Point([118.88080192889979, 32.303362610639844]),
            {
              "landcover": 2,
              "system:index": "32"
            }),
        ee.Feature(
            ee.Geometry.Point([118.87445045795252, 32.30742513551633]),
            {
              "landcover": 2,
              "system:index": "33"
            }),
        ee.Feature(
            ee.Geometry.Point([118.67591463431984, 32.30697776289019]),
            {
              "landcover": 2,
              "system:index": "34"
            }),
        ee.Feature(
            ee.Geometry.Point([118.68089281425148, 32.31162044835561]),
            {
              "landcover": 2,
              "system:index": "35"
            }),
        ee.Feature(
            ee.Geometry.Point([118.6851843486753, 32.31336139406819]),
            {
              "landcover": 2,
              "system:index": "36"
            }),
        ee.Feature(
            ee.Geometry.Point([118.87276406420472, 32.21294229391479]),
            {
              "landcover": 2,
              "system:index": "37"
            }),
        ee.Feature(
            ee.Geometry.Point([118.87031788958313, 32.21032797202044]),
            {
              "landcover": 2,
              "system:index": "38"
            }),
        ee.Feature(
            ee.Geometry.Point([118.81924923763175, 32.20883537365758]),
            {
              "landcover": 2,
              "system:index": "39"
            }),
        ee.Feature(
            ee.Geometry.Point([118.82251080379386, 32.20219019155884]),
            {
              "landcover": 2,
              "system:index": "40"
            }),
        ee.Feature(
            ee.Geometry.Point([118.85217404001509, 32.19510495047189]),
            {
              "landcover": 2,
              "system:index": "41"
            }),
        ee.Feature(
            ee.Geometry.Point([118.83020138376509, 32.186715423510314]),
            {
              "landcover": 2,
              "system:index": "42"
            }),
        ee.Feature(
            ee.Geometry.Point([118.82186531217543, 32.17060688432541]),
            {
              "landcover": 2,
              "system:index": "43"
            }),
        ee.Feature(
            ee.Geometry.Point([118.83263706357924, 32.17293174412499]),
            {
              "landcover": 2,
              "system:index": "44"
            }),
        ee.Feature(
            ee.Geometry.Point([118.83381609234134, 32.16765488938076]),
            {
              "landcover": 2,
              "system:index": "45"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8105805781295, 32.16509500637516]),
            {
              "landcover": 2,
              "system:index": "46"
            }),
        ee.Feature(
            ee.Geometry.Point([118.53226968109024, 32.0580489843354]),
            {
              "landcover": 2,
              "system:index": "47"
            }),
        ee.Feature(
            ee.Geometry.Point([118.55595895110977, 32.070268896857776]),
            {
              "landcover": 2,
              "system:index": "48"
            }),
        ee.Feature(
            ee.Geometry.Point([118.39459725677384, 32.04990146905063]),
            {
              "landcover": 2,
              "system:index": "49"
            }),
        ee.Feature(
            ee.Geometry.Point([118.56660195648087, 32.100229864841424]),
            {
              "landcover": 2,
              "system:index": "50"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95275804481905, 31.98100488768304]),
            {
              "landcover": 2,
              "system:index": "51"
            }),
        ee.Feature(
            ee.Geometry.Point([118.99086687050264, 32.01565286891675]),
            {
              "landcover": 2,
              "system:index": "52"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8641068184142, 31.898620314497204]),
            {
              "landcover": 2,
              "system:index": "53"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8644501411681, 31.89104163523989]),
            {
              "landcover": 2,
              "system:index": "54"
            }),
        ee.Feature(
            ee.Geometry.Point([118.71623192954591, 31.74014232385931]),
            {
              "landcover": 2,
              "system:index": "55"
            }),
        ee.Feature(
            ee.Geometry.Point([118.90296763225501, 31.7739520502712]),
            {
              "landcover": 2,
              "system:index": "56"
            }),
        ee.Feature(
            ee.Geometry.Point([118.90434092327064, 31.77935148245899]),
            {
              "landcover": 2,
              "system:index": "57"
            }),
        ee.Feature(
            ee.Geometry.Point([119.07538654180155, 31.57031455101628]),
            {
              "landcover": 2,
              "system:index": "58"
            }),
        ee.Feature(
            ee.Geometry.Point([119.14475860360741, 31.49574047571915]),
            {
              "landcover": 2,
              "system:index": "59"
            })]),
    hunjiao = /* color: #ffc82d */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([118.70848327530335, 32.441523718859436]),
            {
              "landcover": 3,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([118.70739966286133, 32.44064542932089]),
            {
              "landcover": 3,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([118.70656281364869, 32.4405005559975]),
            {
              "landcover": 3,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([118.70657354248475, 32.439812404531686]),
            {
              "landcover": 3,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([118.62100292921168, 32.50557315635509]),
            {
              "landcover": 3,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([118.62204362630946, 32.50568173286304]),
            {
              "landcover": 3,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([118.62492928974827, 32.50303273216429]),
            {
              "landcover": 3,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([118.62189302914341, 32.50315036003177]),
            {
              "landcover": 3,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([118.60704837913146, 32.563979063251]),
            {
              "landcover": 3,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([118.6102992164575, 32.56529016772648]),
            {
              "landcover": 3,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([118.61004172439208, 32.565027948364275]),
            {
              "landcover": 3,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Point([118.6104065048181, 32.56763202390203]),
            {
              "landcover": 3,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Point([118.6125308143579, 32.56702622140972]),
            {
              "landcover": 3,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Point([118.61469803924193, 32.565850772067826]),
            {
              "landcover": 3,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Point([118.87092251611938, 32.55030257737351]),
            {
              "landcover": 3,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8708366854309, 32.54991370413636]),
            {
              "landcover": 3,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Point([118.80196434081299, 32.55563078389601]),
            {
              "landcover": 3,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Point([118.81623369277222, 32.5547083924205]),
            {
              "landcover": 3,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Point([118.81661993087036, 32.55450944399661]),
            {
              "landcover": 3,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8170061689685, 32.55230289554377]),
            {
              "landcover": 3,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Point([118.81580453932983, 32.55116342715252]),
            {
              "landcover": 3,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Point([118.79717927993042, 32.55134429611695]),
            {
              "landcover": 3,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Point([118.83082365844339, 32.552058856811335]),
            {
              "landcover": 3,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Point([118.84237623179186, 32.547658112786124]),
            {
              "landcover": 3,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8370776167164, 32.55773172992399]),
            {
              "landcover": 3,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Point([118.85332934521986, 32.557984927840856]),
            {
              "landcover": 3,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Point([118.88511723703427, 32.367457323108496]),
            {
              "landcover": 3,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Point([118.88644761270565, 32.36751169460984]),
            {
              "landcover": 3,
              "system:index": "27"
            }),
        ee.Feature(
            ee.Geometry.Point([118.89588898843807, 32.36292624975106]),
            {
              "landcover": 3,
              "system:index": "28"
            }),
        ee.Feature(
            ee.Geometry.Point([118.8851601523785, 32.36225563160222]),
            {
              "landcover": 3,
              "system:index": "29"
            }),
        ee.Feature(
            ee.Geometry.Point([118.89140433496517, 32.35968186171993]),
            {
              "landcover": 3,
              "system:index": "30"
            }),
        ee.Feature(
            ee.Geometry.Point([118.81731929819998, 32.30117136451067]),
            {
              "landcover": 3,
              "system:index": "31"
            }),
        ee.Feature(
            ee.Geometry.Point([118.81461563151296, 32.298777233464165]),
            {
              "landcover": 3,
              "system:index": "32"
            }),
        ee.Feature(
            ee.Geometry.Point([118.81459417384085, 32.299629696465736]),
            {
              "landcover": 3,
              "system:index": "33"
            }),
        ee.Feature(
            ee.Geometry.Point([118.82893590445762, 32.29538099563545]),
            {
              "landcover": 3,
              "system:index": "34"
            }),
        ee.Feature(
            ee.Geometry.Point([118.82923631186729, 32.29510892109369]),
            {
              "landcover": 3,
              "system:index": "35"
            }),
        ee.Feature(
            ee.Geometry.Point([118.83147863860374, 32.292614866410354]),
            {
              "landcover": 3,
              "system:index": "36"
            }),
        ee.Feature(
            ee.Geometry.Point([118.83614568228965, 32.29308647473833]),
            {
              "landcover": 3,
              "system:index": "37"
            }),
        ee.Feature(
            ee.Geometry.Point([118.82599676429153, 32.287236582564965]),
            {
              "landcover": 3,
              "system:index": "38"
            }),
        ee.Feature(
            ee.Geometry.Point([118.82597503573541, 32.28804582887304]),
            {
              "landcover": 3,
              "system:index": "39"
            }),
        ee.Feature(
            ee.Geometry.Point([118.73832942861532, 32.29470425362118]),
            {
              "landcover": 3,
              "system:index": "40"
            }),
        ee.Feature(
            ee.Geometry.Point([118.73662354368184, 32.29557489316688]),
            {
              "landcover": 3,
              "system:index": "41"
            }),
        ee.Feature(
            ee.Geometry.Point([118.73273970502828, 32.29669945687063]),
            {
              "landcover": 3,
              "system:index": "42"
            }),
        ee.Feature(
            ee.Geometry.Point([118.692626557346, 32.3183934735088]),
            {
              "landcover": 3,
              "system:index": "43"
            }),
        ee.Feature(
            ee.Geometry.Point([118.69349559306683, 32.319767088553604]),
            {
              "landcover": 3,
              "system:index": "44"
            }),
        ee.Feature(
            ee.Geometry.Point([118.7128729604455, 32.3205927276861]),
            {
              "landcover": 3,
              "system:index": "45"
            }),
        ee.Feature(
            ee.Geometry.Point([118.99274572234312, 32.00232976680748]),
            {
              "landcover": 3,
              "system:index": "46"
            }),
        ee.Feature(
            ee.Geometry.Point([118.94184983082378, 31.984892927460407]),
            {
              "landcover": 3,
              "system:index": "47"
            }),
        ee.Feature(
            ee.Geometry.Point([118.93494046040142, 31.982708885207565]),
            {
              "landcover": 3,
              "system:index": "48"
            }),
        ee.Feature(
            ee.Geometry.Point([118.94706404514874, 31.981107221180476]),
            {
              "landcover": 3,
              "system:index": "49"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95993864842022, 31.980979814887014]),
            {
              "landcover": 3,
              "system:index": "50"
            }),
        ee.Feature(
            ee.Geometry.Point([118.96064675160015, 31.97997875928294]),
            {
              "landcover": 3,
              "system:index": "51"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95704186268414, 31.978486256104176]),
            {
              "landcover": 3,
              "system:index": "52"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95670972236285, 31.975840606687836]),
            {
              "landcover": 3,
              "system:index": "53"
            }),
        ee.Feature(
            ee.Geometry.Point([118.96469197639117, 31.975512971344923]),
            {
              "landcover": 3,
              "system:index": "54"
            }),
        ee.Feature(
            ee.Geometry.Point([118.96591506370196, 31.978680063999164]),
            {
              "landcover": 3,
              "system:index": "55"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95808301337847, 31.97261880835346]),
            {
              "landcover": 3,
              "system:index": "56"
            }),
        ee.Feature(
            ee.Geometry.Point([118.9430728072649, 31.971701216148134]),
            {
              "landcover": 3,
              "system:index": "57"
            }),
        ee.Feature(
            ee.Geometry.Point([118.94524003214893, 31.968388255520225]),
            {
              "landcover": 3,
              "system:index": "58"
            }),
        ee.Feature(
            ee.Geometry.Point([118.93687154002247, 31.967059397057795]),
            {
              "landcover": 3,
              "system:index": "59"
            })]),
    CL = /* color: #00ffff */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([118.97380413116093, 31.28592757099258]),
            {
              "landcover": 4,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([119.00384487212773, 31.342536560061166]),
            {
              "landcover": 4,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95042823704127, 31.243747168796588]),
            {
              "landcover": 4,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95210193546656, 31.244591064159373]),
            {
              "landcover": 4,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([118.94944118412378, 31.245783512142108]),
            {
              "landcover": 4,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([118.93952773960474, 31.24141724462536]),
            {
              "landcover": 4,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([118.94823955448511, 31.242132739265408]),
            {
              "landcover": 4,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([118.96625603616233, 31.244831068479538]),
            {
              "landcover": 4,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([118.97202814996238, 31.24284974203619]),
            {
              "landcover": 4,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([118.97501076638694, 31.241565526769953]),
            {
              "landcover": 4,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([118.97466744363304, 31.2405014494645]),
            {
              "landcover": 4,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Point([119.10000988087123, 31.416706247770865]),
            {
              "landcover": 4,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Point([119.12378498157923, 31.4198558507415]),
            {
              "landcover": 4,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Point([119.13116642078822, 31.420478434158195]),
            {
              "landcover": 4,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Point([119.15039249500697, 31.420038963940097]),
            {
              "landcover": 4,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Point([119.15163703998988, 31.420441811718664]),
            {
              "landcover": 4,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Point([119.09747787556117, 31.420112209119452]),
            {
              "landcover": 4,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Point([119.0921531911658, 31.426542121246047]),
            {
              "landcover": 4,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Point([119.08713209588993, 31.434122168172816]),
            {
              "landcover": 4,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Point([119.07077981909845, 31.428581087110093]),
            {
              "landcover": 4,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Point([119.05876352271173, 31.430375414079506]),
            {
              "landcover": 4,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Point([119.0596218295965, 31.441616640204394]),
            {
              "landcover": 4,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Point([119.06481458624933, 31.444911858106536]),
            {
              "landcover": 4,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Point([119.06897737464044, 31.445497662490926]),
            {
              "landcover": 4,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Point([119.0854139514837, 31.445497662490926]),
            {
              "landcover": 4,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Point([119.07107619701054, 31.45582925489021]),
            {
              "landcover": 4,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Point([119.06671985420877, 31.454943350146813]),
            {
              "landcover": 4,
              "system:index": "26"
            }),
        ee.Feature(
            ee.Geometry.Point([119.03817657775872, 31.591893010811976]),
            {
              "landcover": 4,
              "system:index": "27"
            }),
        ee.Feature(
            ee.Geometry.Point([119.02015213317864, 31.597668574853387]),
            {
              "landcover": 4,
              "system:index": "28"
            }),
        ee.Feature(
            ee.Geometry.Point([119.02641777343743, 31.60468649978969]),
            {
              "landcover": 4,
              "system:index": "29"
            }),
        ee.Feature(
            ee.Geometry.Point([119.06596823583938, 31.63247639662541]),
            {
              "landcover": 4,
              "system:index": "30"
            }),
        ee.Feature(
            ee.Geometry.Point([119.06459494482375, 31.633061025229747]),
            {
              "landcover": 4,
              "system:index": "31"
            }),
        ee.Feature(
            ee.Geometry.Point([119.06244917761184, 31.63676967734168]),
            {
              "landcover": 4,
              "system:index": "32"
            }),
        ee.Feature(
            ee.Geometry.Point([118.93234016696412, 31.636848195955167]),
            {
              "landcover": 4,
              "system:index": "33"
            }),
        ee.Feature(
            ee.Geometry.Point([118.93286587993104, 31.637085690605105]),
            {
              "landcover": 4,
              "system:index": "34"
            }),
        ee.Feature(
            ee.Geometry.Point([118.93708231250245, 31.638519780025476]),
            {
              "landcover": 4,
              "system:index": "35"
            }),
        ee.Feature(
            ee.Geometry.Point([118.9535525775583, 31.638108452187005]),
            {
              "landcover": 4,
              "system:index": "36"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95917448765351, 31.637560392722616]),
            {
              "landcover": 4,
              "system:index": "37"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95565542942597, 31.639021877449938]),
            {
              "landcover": 4,
              "system:index": "38"
            }),
        ee.Feature(
            ee.Geometry.Point([118.9521340295251, 31.650241432443405]),
            {
              "landcover": 4,
              "system:index": "39"
            }),
        ee.Feature(
            ee.Geometry.Point([118.98786818045357, 31.650058770153265]),
            {
              "landcover": 4,
              "system:index": "40"
            }),
        ee.Feature(
            ee.Geometry.Point([118.9678267146943, 31.656232556573915]),
            {
              "landcover": 4,
              "system:index": "41"
            }),
        ee.Feature(
            ee.Geometry.Point([118.95246302145699, 31.6544790968046]),
            {
              "landcover": 4,
              "system:index": "42"
            }),
        ee.Feature(
            ee.Geometry.Point([118.94250666159371, 31.66134662525407]),
            {
              "landcover": 4,
              "system:index": "43"
            }),
        ee.Feature(
            ee.Geometry.Point([118.94358442863388, 31.670736151420485]),
            {
              "landcover": 4,
              "system:index": "44"
            }),
        ee.Feature(
            ee.Geometry.Point([118.94083784660263, 31.674863312926334]),
            {
              "landcover": 4,
              "system:index": "45"
            }),
        ee.Feature(
            ee.Geometry.Point([118.93199728568955, 31.674753744636988]),
            {
              "landcover": 4,
              "system:index": "46"
            }),
        ee.Feature(
            ee.Geometry.Point([118.98864905722566, 31.677237260782565]),
            {
              "landcover": 4,
              "system:index": "47"
            }),
        ee.Feature(
            ee.Geometry.Point([119.00512404870516, 31.6607222671543]),
            {
              "landcover": 4,
              "system:index": "48"
            }),
        ee.Feature(
            ee.Geometry.Point([119.03233237695223, 31.666785767448225]),
            {
              "landcover": 4,
              "system:index": "49"
            }),
        ee.Feature(
            ee.Geometry.Point([119.02835449386653, 31.681843587886018]),
            {
              "landcover": 4,
              "system:index": "50"
            }),
        ee.Feature(
            ee.Geometry.Point([119.04792389083919, 31.6863719569276]),
            {
              "landcover": 4,
              "system:index": "51"
            }),
        ee.Feature(
            ee.Geometry.Point([119.07529248192905, 31.690919214140497]),
            {
              "landcover": 4,
              "system:index": "52"
            }),
        ee.Feature(
            ee.Geometry.Point([119.0597571273148, 31.69500896364631]),
            {
              "landcover": 4,
              "system:index": "53"
            }),
        ee.Feature(
            ee.Geometry.Point([119.08855332329868, 31.69124786138584]),
            {
              "landcover": 4,
              "system:index": "54"
            }),
        ee.Feature(
            ee.Geometry.Point([119.08267392113804, 31.693584874897958]),
            {
              "landcover": 4,
              "system:index": "55"
            }),
        ee.Feature(
            ee.Geometry.Point([119.08327473595737, 31.69610440165704]),
            {
              "landcover": 4,
              "system:index": "56"
            }),
        ee.Feature(
            ee.Geometry.Point([119.06113041833042, 31.713301082820077]),
            {
              "landcover": 4,
              "system:index": "57"
            }),
        ee.Feature(
            ee.Geometry.Point([119.06293286278843, 31.714505826306187]),
            {
              "landcover": 4,
              "system:index": "58"
            }),
        ee.Feature(
            ee.Geometry.Point([119.02854107976131, 31.71767653064418]),
            {
              "landcover": 4,
              "system:index": "59"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var njp = njp.geometry();


// 8月分的影像
var img8 = ee.ImageCollection(Sen)
    .filterBounds(njp)
    .filterDate('2022-08-01','2022-09-01')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',15))
    .sort('CLOUDY_PIXEL_PERCENTAGE');
    // .mosaic()
    // .clip(njp);

print(img8);
img8 = img8.mosaic().clip(njp);


// 12月份的影像
var img12 = ee.ImageCollection(Sen)
    .filterBounds(njp)
    .filterDate('2022-12-01','2023-01-01')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',15))
    .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mosaic()
    .clip(njp);

// 加载真彩色影像

img8 = img8
    .select('B4','B3','B2','B8','B11')
    .rename('red','green','blue','nir','swir');


img12 = img12
    .select('B4','B3','B2','B8','B11')
    .rename('red','green','blue','nir','swir');

Map.centerObject(nj,9);

Map.addLayer(img8,{bands:['red','green','blue']},"img8_true", 0);
Map.addLayer(img12,{bands:['red','green','blue']},"img12_true", 0);


// 计算8/12月份NDVI,同时为结果值重命名
var ndvi8 = img8
    .normalizedDifference(['nir','red']).rename('ndvi8');

var ndvi12 = img12
    .normalizedDifference(['nir','red']).rename('ndvi12');



// 显示NDVI和真彩色
var pal = ['1666ff','7296ff','72ffa5','fffb4f','ffb453','ff0e00'];  // 蓝到红



Map.addLayer(ndvi8, {palette:pal}, "ndvi8", 0);
Map.addLayer(ndvi12, {palette:pal}, "ndvi12", 0);


// 植被类型分类
// 创建一个值为1的起始图像（阈值上限）
var type = ee.Image(0).clip(njp);

// C1值为ndvi8
// C2值为内层计算公式
var C2 = (ndvi8.subtract(ndvi12)).divide(ndvi8);

// 根据8/12月份的NDVI数据进行植被分类,都按照C2来计算

var type = type.where(ndvi8.lt(0.2),1);
var type = type.where(ndvi8.gte(0.2).and(ndvi8.lte(0.5)),2);
var type = type.where(ndvi8.gte(0.5).and(ndvi8.lte(1))
    .and(C2.gt(0.35)),3);
var type = type.where(ndvi8.gte(0.5).and(ndvi8.lte(1))
    .and(C2.gt(0.2).and(C2.lt(0.35))),4);
var type = type.where(ndvi8.gte(0.5).and(ndvi8.lte(1))
    .and(C2.lt(0.2)),5);

// 加载植被分类图像
Map.addLayer(type,{palette:pal},'type',0);



























// 精度验证,验证植被类型
var bands = ['constant'];
var classNames = luodi.merge(grass).merge(LY).merge(hunjiao).merge(CL);
var training = type.sampleRegions({
collection: classNames,
properties: ['landcover'],
scale: 10});

var withRandom = training.randomColumn('random');//样本点随机的排列
// 保留一些数据进行测试，以避免模型过度拟合。
var split = 0.7; 

var trainingPartition = withRandom.filter(ee.Filter.lt('random', split));//筛选70%的样本作为训练样本
var testingPartition = withRandom.filter(ee.Filter.gte('random', split));//筛选30%的样本作为测试样本

//分类方法选择smileCart() randomForest() minimumDistance libsvm
var classifier = ee.Classifier.libsvm().train({
  features: trainingPartition,
  classProperty: 'landcover',
  inputProperties: bands
});
var test = testingPartition.classify(classifier);
var confusionMatrix = test.errorMatrix('landcover', 'classification');
print('confusionMatrix',confusionMatrix);//面板上显示混淆矩阵
print('overall accuracy', confusionMatrix.accuracy());//面板上显示总体精度
print('kappa accuracy', confusionMatrix.kappa());//面板上显示kappa值




















// 计算NIRV,同时为结果值重命名,可以直接重命名
var nirv = ndvi12
    .multiply(img12.select('nir'))
    .multiply(0.0001)
    .rename('nirv');


// 加载NIRV数据
Map.addLayer(nirv,{palette:pal},'NIRV',0);

// 计算GPP
var gpp = ee.Image(1).clip(njp);

var gpp = gpp.where(type.eq(1).or(type.eq(0)),0);
var gpp = gpp.where(type.eq(2),nirv.multiply(68.13).subtract(1.62));
var gpp = gpp.where(type.eq(3),nirv.multiply(64.07).subtract(2.20));
var gpp = gpp.where(type.eq(4),nirv.multiply(59.49).subtract(2.93));
var gpp = gpp.where(type.eq(5),nirv.multiply(44.50).subtract(2.60));

// njp = njp.geometry();
// gpp = gpp.clip(njp);
Map.addLayer(gpp,{palette:pal},'gpp');

// mndwi的计算
// var waterpalette = ['green','white','blue']
// var mndwi = img8.normalizedDifference(['green','swir']);
// Map.addLayer(mndwi,{palette:waterpalette,min:-0.5,
//   max:1,},'mndwi');


Export.image.toDrive({
image:ndvi12, //分类结果
description:'sen_ndvi', //文件名
//folder: //云盘中的文件夹
scale: 10, //分辨率
//region: roi, //区域
maxPixels:34e10 //此处值设置大一些，防止溢出
});

Export.image.toDrive({
image:nirv, //分类结果
description:'nirv', //文件名
//folder: //云盘中的文件夹
scale: 10, //分辨率
//region: roi, //区域
maxPixels:34e10 //此处值设置大一些，防止溢出
});

Export.image.toDrive({
image:type, //分类结果
description:'type', //文件名
//folder: //云盘中的文件夹
scale: 10, //分辨率
//region: roi, //区域
maxPixels:34e10 //此处值设置大一些，防止溢出
});


Export.image.toDrive({
image:gpp, //分类结果
description:'gpp', //文件名
//folder: //云盘中的文件夹
scale: 10, //分辨率
//region: roi, //区域
maxPixels:34e10 //此处值设置大一些，防止溢出
});
