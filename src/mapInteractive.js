var coorData = coorData.NumberOfAlarmHandling
var netnodePoints = getNetNode(coorData)
var rectDataArr = []
var multiArr = []
// --------------------------------百度地图----------------------------------

var map = new BMap.Map('allmap') // 创建Map实例
var mPoint = new BMap.Point(116.404, 39.915) // 设置地图的区域
var myStyleJson = [{
  'featureType': 'all',
  'elementType': 'all',
  'stylers': {
    'lightness': 10,
    'saturation': -100
  }}
]
map.setMapStyle({styleJson: myStyleJson})
map.enableContinuousZoom() // 启用地图惯性拖拽，默认禁用
map.addControl(new BMap.MapTypeControl()) // 添加地图类型控件
map.addControl(new BMap.NavigationControl()) // 添加默认缩放平移控件
map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
map.centerAndZoom(mPoint, 13) // 区域，及滚轮的伸缩
map.addControl(new BMap.OverviewMapControl()) // 添加默认缩略地图控件
map.addControl(new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT })) // 右下角，打开

function getNetNode (dataArr) {
  return dataArr.map(function (item, index) {
    var lng = dataArr[index].longitude
    var dim = dataArr[index].dimension
    return tmpPoint = new BMap.Point(lng, dim)
  })
}

netnodePoints.forEach(function (points, index) {
  var x = points.lng
  var y = points.lat
  var newPoint = new BMap.Point(x, y)

  var myIcon = new BMap.Icon('./static/img/ceshi1.svg', new BMap.Size(14, 14))

  var newMarker = new BMap.Marker(newPoint, {icon: myIcon})
  map.addOverlay(newMarker)

  var content = '<br/><br/>网点名：' + coorData[index].baidu_address
  var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + content + '</p>')
  newMarker.addEventListener('mouseover', function () { this.openInfoWindow(infoWindow) })
})

// -----------------------------------初始化矩形symbol-------------------------------------

var rectangle_overlay = new BMap.Marker(new BMap.Point(mPoint.lng, mPoint.lat), {
  icon: new BMap.Symbol(BMap_Symbol_SHAPE_RECTANGLE, { // 覆盖物更改为长4px，宽2px的矩形
    scale: 45, // 覆盖框增大比例
    strokeWeight: 2,
    strokeColor: '#3D59AB', // 边框大小
    strokeStyle: 'solid', // 边线的样式
    fillColor: '#3D59AB', // 覆盖框颜色
    fillOpacity: 0.2 // 透明度
  })
})
map.addOverlay(rectangle_overlay) // 在地图上添加覆盖物
rectangle_overlay.enableDragging() // 允许拖拽

var bounds = map.getBounds() // 假设定义好了百度地图为map
var geoPointLB = bounds.getSouthWest() // 左下角点地理坐标
var geoPointRT = bounds.getNorthEast() // 右上角点地理坐标
var pixelPointLB = map.pointToPixel(geoPointLB) // 左下角点像素坐标
var pixelPointRT = map.pointToPixel(geoPointRT) // 右上角点像素坐标

var resX = (geoPointRT.lng - geoPointLB.lng) / (pixelPointRT.x - pixelPointLB.x) // 分辨率 = 经度差 / x差
var resY = (geoPointRT.lat - geoPointLB.lat) / (pixelPointRT.y - pixelPointLB.y) // 分辨率 = 纬度差 / y差

// -----------------------拖拽动作结束后响应事件-------------------------------------------

rectangle_overlay.addEventListener('dragend', function () {
  var rStartX = rectangle_overlay.getPosition().lng - (resX * 160) // lng值
  var rStartY = rectangle_overlay.getPosition().lat - (resY * 80) // lat值
  var rEndX = rectangle_overlay.getPosition().lng + (resX * 160) // lng值
  var rEndY = rectangle_overlay.getPosition().lat + (resY * 80) // lat值

  // 确定框内的各报警点数
  function check (points) {
    var pts = []
    points.forEach(function (point, index) {
      var y = point.dimension
      var x = point.longitude
      if (y >= rEndY && y <= rStartY) {
        if (x >= rStartX && x <= rEndX) {
          pts.push(point)
        }
      }
    })
    return pts
  }
  rectDataArr = check(coorData) // 每次拖拽结束后矩形框内的图元数据
  console.log(rectDataArr)
  multiArr.push(rectDataArr) // 总共拖拽次数数组累计
})
console.log(multiArr)
