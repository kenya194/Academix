import React from "react";
import * as Strings from "./Strings.json";
import { convertBase } from "baseroo";
import { Buffer } from "buffer";

let url = Strings.URL;
//global.cr;
global.transCheck;

export function ERC(sevicepath, params) {
  var r;
  return fetch(url + sevicepath, params)
    .then((response) => response.json())
    .then(
      (data) => {
        let vals = data.toString().split(",");
        var val1;
        var val2;
        val1 = Buffer.from(vals[0], "base64").toString("ascii");
        val2 = Buffer.from(vals[1], "base64").toString("ascii");
        r = convertBase(val1, "3", "10");
        global.exr = Number(r) / Number(val2);
      },
      (error) => {
        console.log(
          "\n\nThere has been a problem with your fetch operation: " +
            "\n\n" +
            error.message
        );
      }
    );
}

export function CTA(sevicepath, params) {
  return fetch(url + sevicepath, params)
    .then((response) => response.json())
    .then(
      (data) => {
        global.cta = data;
        global.submitColorSet(data);
      },
      (error) => {
        console.log(
          "\n\nThere has been a problem with your fetch operation: " +
            "\n\n" +
            error.message
        );
      }
    );
}

export function CMRC(sevicepath, params) {
  let response = fetch(url + sevicepath, params)
    .then((response) => response.json())
    .then(
      (data) => {
        global.cr = data;
      },
      (error) => {
        console.log(
          "\n\nThere has been a problem with your fetch operation: " +
            "\n\n" +
            error.message
        );
      }
    );
}

export function PTR(sevicepath, params) {
  const promise = new Promise((resolve, reject) => {
    let response = fetch(url + sevicepath, params)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));     
  });
  return promise;
}

export function convertLocalBase(value, from_base, to_base) {
  console.log(value + " Old Base Value");
  var range =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split(
      ""
    );
  var from_range = range.slice(0, from_base);
  var to_range = range.slice(0, to_base);

  var dec_value = value
    .split("")
    .reverse()
    .reduce(function (carry, digit, index) {
      console.log(from_range + " from_range");
      console.log(digit + " digit");
      if (from_range.indexOf(digit) === -1)
        throw new Error(
          "Invalid digit `" + digit + "` for base " + from_base + "."
        );
      return (carry += from_range.indexOf(digit) * Math.pow(from_base, index));
    }, 0);

  var new_value = "";
  while (dec_value > 0) {
    new_value = to_range[dec_value % to_base] + new_value;
    dec_value = (dec_value - (dec_value % to_base)) / to_base;
  }
  console.log(new_value + " New Base Value");
  return new_value || "0";
}

function BytesToString(r) {
  let utf8Encode = new TextEncoder();
  return utf8Encode.encode(r);
}
