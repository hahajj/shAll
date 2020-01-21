package com.njsw.ssms.modules.ship.rest;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.njsw.logging.aop.log.Log;
import com.njsw.ssms.config.DeviceAPI;
import com.njsw.ssms.modules.ship.domain.ShipInterface;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


/**
 * @date 2019-12-04
 */
@Api(tags = "外部接口参数管理")
@RestController
@RequestMapping("api")
public class ShipInterfaceController {



    @ApiOperation(value = "查询getDevice")
    @GetMapping(value = "/devices")
    public String getDevices() {
        return DeviceAPI.getDevice();
    }

    @ApiOperation(value = "查询cameras")
    @GetMapping(value = "/devices/{sn}/cameras")
    public ResponseEntity getCameras(@PathVariable String sn) {
        JSONArray jsonArray = JSONArray.parseArray(DeviceAPI.getCameras(sn));
        return new ResponseEntity(jsonArray, HttpStatus.OK);
    }

    @ApiOperation(value = "查询视频地址")
    @GetMapping(value = "/devices/{sn}/{cameraId}/{quality}/live")
    public String getLives(@PathVariable String sn, @PathVariable Integer cameraId, @PathVariable String quality) {
        return DeviceAPI.getDeviceLive(sn, cameraId, quality);
    }

    @ApiOperation(value = "查询Rtmp")
    @GetMapping(value = "/devices/rtmp/{sn}")
    public ResponseEntity getRtmp(@PathVariable String sn) {
        JSONArray jsonArray = JSONArray.parseArray(DeviceAPI.getCameras(sn));
        List<HashMap<String, Object>> list = new ArrayList<HashMap<String, Object>>();
        jsonArray.forEach(json -> {
            if (json != null && JSON.parseObject(json.toString()).getString("online").equals("true")) {
                JSONObject cameraObject = JSON.parseObject(json.toString());
                Object obj = cameraObject.getString("id");
                JSONObject jsobj = JSON.parseObject(obj.toString());
                String cameraId = jsobj.getString("cameraId");
                String name =cameraObject.getString("name");
                JSONObject cameraData = JSON.parseObject(getLivesRtmp(sn, cameraId));
                HashMap<String, Object> map = new HashMap<>();
                map.put("sn", sn);
                map.put("name", name);
                map.put("cameraId", cameraId);
                map.put("data", JSONArray.parseArray(cameraData.getString("data")).getJSONObject(0));
                list.add(map);
            }
        });
        return new ResponseEntity(list, HttpStatus.OK);
    }

    @ApiOperation(value = "查询视频地址Rtmp 单个")
    @GetMapping(value = "/devices/rtmpOne/{sn}/{cameraId}")
    public String getLivesRtmp(@PathVariable String sn, @PathVariable String cameraId) {
        return DeviceAPI.putDeviceLive(sn, cameraId, "getAddress");
    }


    /**
     * 查询外部接口 获取视频地址
     *
     * @param sn        设备识别号
     * @param cameraId  摄像头序列号
     * @param startTime 开始时间
     * @param endTime   结束时间
     * @return 视频地址
     */
    @ApiOperation(value = "查询录播地址")
    @GetMapping(value = "/devices/rec")
    public String getrec(String sn, Integer cameraId, String startTime, String endTime) {
        return DeviceAPI.getDeviceRec(sn, cameraId, startTime, endTime);
    }

    @ApiOperation(value = "云台控制")
    @GetMapping(value = "/devices/ptz")
    public ResponseEntity getptz(String sn, Integer id, String command, String direction, String speed, String stopAfter) {//传 stopAfter则为连续控制 不传为云台控制
        JSONObject jsonObject = JSONObject.parseObject(DeviceAPI.putDevice(sn, id, command, direction, speed, stopAfter));
        return new ResponseEntity(jsonObject, HttpStatus.OK);
    }
    @ApiOperation(value = "修改cameraName")
    @GetMapping(value = "/devices/changeCameraName/{sn}/{id}/{name}")
    public ResponseEntity changeCameraName(@PathVariable String sn, @PathVariable String id,@PathVariable String name) {
        JSONObject jsonObject = JSONObject.parseObject(DeviceAPI.changeCameraName(sn,id,name));
        return new ResponseEntity(jsonObject, HttpStatus.OK);
    }
    @ApiOperation(value = "修改cameraNames")
    @PostMapping(value = "/devices/changeCameraNames")
    public ResponseEntity changeCameraNames(@RequestBody  List<ShipInterface> ship) {
        try {
            ship.forEach(json -> {
                if (json != null) {
                    DeviceAPI.changeCameraName(json.getSn(),json.getId(),json.getName());
                }
            });
        }catch (Exception e){
            return new ResponseEntity( HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity("{\"data\":\"success\"}", HttpStatus.OK);
    }
}


