package com.njsw.ssms.config;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.codec.binary.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;
import java.util.TimeZone;
@Slf4j
public class DeviceAPI {


    private static final String HMAC_SHA1_ALGORITHM = "HmacSHA1";
    private static final String uri = "http://47.105.207.119:8080/devices";

    /**
     * 设备列表
     */
    public static String getDevice() {
        try {
            URL url = new URL(uri);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setDoOutput(true); // 设置该连接是可以输出的
            connection.setRequestMethod("GET"); // 设置请求方式
            String genHMAC = genHMAC("GET\n" + "" + '\n' + "/devices", "z5j6o6rwv7565jn950hvoopb1y1d3p2i");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Authorization", "JAS ir5n5hozzta6mjco:" + genHMAC);
            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));

            String line = null;
            StringBuilder result = new StringBuilder();
            while ((line = br.readLine()) != null) { // 读取数据
                result.append(line + "\n");
            }
            connection.disconnect();
            log.info("获取设备接口返回:" + result.toString());
            return result.toString();
        } catch (Exception e) {
            log.error("获取设备接口异常", e);
            return null;
        }
    }

    /**
     * 摄像头列表
     */
    public static String getCameras(String sn) {
        try {
            String urls = "/" + sn + "/cameras";
            URL url = new URL(uri + urls);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setDoOutput(true); // 设置该连接是可以输出的
            connection.setRequestMethod("GET"); // 设置请求方式
            String genHMAC = genHMAC("GET\n" + "" + '\n' + "/devices" + urls, "z5j6o6rwv7565jn950hvoopb1y1d3p2i");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Authorization", "JAS ir5n5hozzta6mjco:" + genHMAC);
            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));

            String line = null;
            StringBuilder result = new StringBuilder();
            while ((line = br.readLine()) != null) { // 读取数据
                result.append(line + "\n");
            }
            connection.disconnect();
            log.info("获取摄像头接口返回:" + result.toString());
            return result.toString();
        } catch (Exception e) {
            log.error("获取摄像头接口异常", e);
            return null;
        }
    }

    /**
     * 获取直播地址
     * 使用 HMAC-SHA1 签名方法对data进行签名
     *
     * @param sn 设备识别码
     * @param id  摄像头序列号
     * @param hd  视频流清晰度
     * @return 直播地址
     */
    public static String getDeviceLive(String sn, Integer id, String hd) {
        try {
            String urls = "/" + sn + "/cameras/" + id + "." + hd + ".live";
            URL url = new URL(uri + urls);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setDoOutput(true); // 设置该连接是可以输出的
            connection.setRequestMethod("GET"); // 设置请求方式
            Calendar cd = Calendar.getInstance();
            SimpleDateFormat sdf = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss 'GMT'", Locale.US);
            sdf.setTimeZone(TimeZone.getTimeZone("GMT")); // 设置时区为GMT
            String str = "";
            System.out.println("GET\n" + str + '\n' + "/devices" + urls);
            String genHMAC = genHMAC("GET\n" + str + '\n' + "/devices" + urls, "z5j6o6rwv7565jn950hvoopb1y1d3p2i");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Authorization", "JAS ir5n5hozzta6mjco:" + genHMAC);
            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));
            String line = null;
            StringBuilder result = new StringBuilder();
            while ((line = br.readLine()) != null) { // 读取数据
                result.append(line + "\n");
            }
            connection.disconnect();

            log.info("获取直播返回:" + result.toString());
            return result.toString();
        } catch (Exception e) {
            log.error("获取直播异常", e);
            return null;
        }
    }

    /**
     * 获取录播回看地址
     * 使用 HMAC-SHA1 签名方法对data进行签名
     *
     * @param sn 设备识别码
     * @param id  摄像头序列号
     * @param startTime  开始时间
     * @param endTime  结束时间
     * @return 回看地址
     */
    public static String getDeviceRec(String sn, Integer id, String startTime, String endTime) {
        try {
            String urls = "/" + sn + "/cameras/" + id + ".local.rec";
            URL url = new URL(uri + urls + "?startTime=" + startTime + "&endTime=" + endTime);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true); // 设置该连接是可以输出的
            connection.setRequestMethod("GET"); // 设置请求方式
            Calendar cd = Calendar.getInstance();
            SimpleDateFormat sdf = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss 'GMT'", Locale.US);
            sdf.setTimeZone(TimeZone.getTimeZone("GMT")); // 设置时区为GMT
            String str = "";
            String genHMAC = genHMAC("GET\n" + str + '\n' + "/devices" + urls, "z5j6o6rwv7565jn950hvoopb1y1d3p2i");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Authorization", "JAS ir5n5hozzta6mjco:" + genHMAC);
            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));
            String line = null;
            StringBuilder result = new StringBuilder();
            while ((line = br.readLine()) != null) { // 读取数据
                result.append(line + "\n");
            }
            connection.disconnect();
            log.info("获取录播返回:" + result.toString());
            return result.toString();
        } catch (Exception e) {
            log.error("获取录播异常", e);
            return null;
        }
    }


    /**
     * 云台控制
     */
    public static String putDevice(String sn, Integer id, String command, String direction, String speed, String stopAfter) {
        try {
            String urls = "/" + sn + "/cameras/" + id + "/ptz";
            URL url = new URL(uri + urls);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setDoOutput(true); // 设置该连接是可以输出的
            connection.setRequestMethod("PUT"); // 设置请求方式
            Calendar cd = Calendar.getInstance();
            SimpleDateFormat sdf = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss 'GMT'", Locale.US);
            sdf.setTimeZone(TimeZone.getTimeZone("GMT")); // 设置时区为GMT
//            String str = sdf.format(cd.getTime());
            String str = "";
            System.out.println("PUT\n" + str + '\n' + "/devices" + urls);
            String genHMAC = genHMAC("PUT\n" + str + '\n' + "/devices" + urls, "z5j6o6rwv7565jn950hvoopb1y1d3p2i");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Authorization", "JAS ir5n5hozzta6mjco:" + genHMAC);
            System.out.println("JAS ir5n5hozzta6mjco:" + genHMAC);

            JSONObject parm = new JSONObject();
            OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream(), "UTF-8");
            parm.put("command", command);
            parm.put("direction", direction);
            parm.put("speed", speed);
            if (stopAfter != null) {
                parm.put("stopAfter", stopAfter);
            }
            writer.write(parm.toString());
            writer.flush();
            InputStream is = connection.getInputStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));

            String line = null;
            StringBuilder result = new StringBuilder();
            while ((line = br.readLine()) != null) { // 读取数据
                result.append(line + "\n");
            }
            connection.disconnect();

            log.info("获取云台控制接口返回:" + result.toString());
            return result.toString();
        } catch (Exception e) {
            log.error("获取云台控制接口异常", e);
            return null;
        }
    }

    /**
     * 获取直播地址 rtmp格式
     * 使用 HMAC-SHA1 签名方法对data进行签名
     *
     * @param sn 设备识别码
     * @param id  摄像头序列号
     * @param command   getAddress获取地址 open开启  close关闭
     * @return 回看地址
     */
    public static String putDeviceLive(String sn, String id, String command) {
        try {
            String urls = "/" + sn + "/cameras/" + id + "/live";
            URL url = new URL(uri + urls);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setDoOutput(true); // 设置该连接是可以输出的
            connection.setRequestMethod("PUT"); // 设置请求方式
            Calendar cd = Calendar.getInstance();
            SimpleDateFormat sdf = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss 'GMT'", Locale.US);
            sdf.setTimeZone(TimeZone.getTimeZone("GMT")); // 设置时区为GMT
//            String str = sdf.format(cd.getTime());
            String str = "";
            System.out.println("PUT\n" + str + '\n' + "/devices" + urls);
            String genHMAC = genHMAC("PUT\n" + str + '\n' + "/devices" + urls, "z5j6o6rwv7565jn950hvoopb1y1d3p2i");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Authorization", "JAS ir5n5hozzta6mjco:" + genHMAC);
            System.out.println("JAS ir5n5hozzta6mjco:" + genHMAC);

            JSONObject parm = new JSONObject();
            OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream(), "UTF-8");
            parm.put("command", command);
            writer.write(parm.toString());
            writer.flush();
            InputStream is = connection.getInputStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));

            String line = null;
            StringBuilder result = new StringBuilder();
            while ((line = br.readLine()) != null) { // 读取数据
                result.append(line + "\n");
            }
            connection.disconnect();

            log.info("获取直播地址接口返回:" + result.toString());
            return result.toString();
        } catch (Exception e) {
            log.error("获取直播地址接口异常", e);
            return null;
        }
    }

    /**
     * 使用 HMAC-SHA1 签名方法对data进行签名
     *
     * @param data 被签名的字符串
     * @param key  密钥
     * @return 加密后的字符串
     */
    public static String genHMAC(String data, String key) {
        byte[] result = null;
        try {
            //根据给定的字节数组构造一个密钥,第二参数指定一个密钥算法的名称
            SecretKeySpec signinKey = new SecretKeySpec(key.getBytes(), HMAC_SHA1_ALGORITHM);
            //生成一个指定 Mac 算法 的 Mac 对象
            Mac mac = Mac.getInstance(HMAC_SHA1_ALGORITHM);
            //用给定密钥初始化 Mac 对象
            mac.init(signinKey);
            //完成 Mac 操作
            byte[] rawHmac = mac.doFinal(data.getBytes());
            result = Base64.encodeBase64(rawHmac);

        } catch (NoSuchAlgorithmException e) {
            System.err.println(e.getMessage());
        } catch (InvalidKeyException e) {
            System.err.println(e.getMessage());
        }
        if (null != result) {
            return new String(result);
        } else {
            return null;
        }
    }


    public static String changeCameraName(String sn, String id, String name) {
        try {
            String urls = "/" + sn + "/cameras/names/batch";
            URL url = new URL(uri + urls);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setDoOutput(true); // 设置该连接是可以输出的
            connection.setRequestMethod("PUT"); // 设置请求方式
            Calendar cd = Calendar.getInstance();
            SimpleDateFormat sdf = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss 'GMT'", Locale.US);
            sdf.setTimeZone(TimeZone.getTimeZone("GMT")); // 设置时区为GMT
            String str = sdf.format(cd.getTime());
//            String str = "";
            System.out.println("PUT\n" + str + '\n' + "/devices" + urls);
            String genHMAC = genHMAC("PUT\n" + str + '\n' + "/devices" + urls, "z5j6o6rwv7565jn950hvoopb1y1d3p2i");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Date", str);
            connection.setRequestProperty("Authorization", "JAS ir5n5hozzta6mjco:" + genHMAC);
            System.out.println("JAS ir5n5hozzta6mjco:" + genHMAC);
            JSONObject obj = new JSONObject();
            obj.put("id", id);
            obj.put("name", name);


            JSONArray array=new JSONArray();
            array.add(obj);
            JSONObject names=new JSONObject();
            names.put("cameraNames", array);
            OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream(), "UTF-8");
            System.out.println(names.toString());
            writer.write(names.toString());
            writer.flush();
            InputStream is = connection.getInputStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));

            String line = null;
            StringBuilder result = new StringBuilder();
            while ((line = br.readLine()) != null) { // 读取数据
                result.append(line + "\n");
            }
            connection.disconnect();

            log.info("修改通道名称返回:" + "{data:成功}");
            return  "{\"data\":\"成功\"}";

        } catch (Exception e) {
            log.error("通道名称接口异常", e);
            return null;
        }
    }
    public static void main(String[] args) {
        String getCameras = changeCameraName("362425040027868","2","2号摄像头");
    }
}
