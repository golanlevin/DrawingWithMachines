import java.io.*;
import java.net.*;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import org.json.simple.JSONObject;

HttpClient httpClient = HttpClientBuilder.create().build();

String sendPut(String url, JSONObject keyArg) {
  StringBuilder result = new StringBuilder();
  try {
    HttpPut putRequest = new HttpPut(url);
    putRequest.addHeader("Content-Type", "application/json");
    putRequest.addHeader("Accept", "application/json");
    StringEntity input;
    try {
      input = new StringEntity(keyArg.toString());
    } 
    catch (Exception e) {
      e.printStackTrace();
      return "success";
    }
    putRequest.setEntity(input);
    HttpResponse response = httpClient.execute(putRequest);
    if ((response.getStatusLine().getStatusCode() != 200)&&(response.getStatusLine().getStatusCode() != 201)&&(response.getStatusLine().getStatusCode() != 202))   {
      throw new RuntimeException("Failed : HTTP error code : "
        + response.getStatusLine().getStatusCode());
    }
    BufferedReader br = new BufferedReader(new InputStreamReader(
      (response.getEntity().getContent())));
    String output;
    while ((output = br.readLine()) != null) {
      result.append(output);
    }
  } 

  catch (IOException e) {
    e.printStackTrace();
  }
  return result.toString();
}

String sendDelete(String url) {
  StringBuilder result = new StringBuilder();
  try {
    HttpDelete deleteRequest = new HttpDelete(url);
    deleteRequest.addHeader("Content-Type", "application/json");
    deleteRequest.addHeader("Accept", "application/json");
    HttpResponse response = httpClient.execute(deleteRequest);
    if ((response.getStatusLine().getStatusCode() != 200)&&(response.getStatusLine().getStatusCode() != 201)&&(response.getStatusLine().getStatusCode() != 202))   {
      throw new RuntimeException("Failed : HTTP error code : "
        + response.getStatusLine().getStatusCode());
    }
    BufferedReader br = new BufferedReader(new InputStreamReader(
      (response.getEntity().getContent())));
    String output;
    while ((output = br.readLine()) != null) {
      result.append(output);
    }
  } 
  catch (IOException e) {
    e.printStackTrace();
  }
  return result.toString();
}