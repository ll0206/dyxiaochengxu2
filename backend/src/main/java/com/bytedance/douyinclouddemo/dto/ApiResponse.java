package com.bytedance.douyinclouddemo.dto;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;
    private Object meta;

    public static <T> ApiResponse<T> ok(T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.setCode(0);
        r.setMessage("");
        r.setData(data);
        return r;
    }

    public static <T> ApiResponse<T> ok(T data, Object meta) {
        ApiResponse<T> r = ok(data);
        r.setMeta(meta);
        return r;
    }

    public static <T> ApiResponse<T> fail(int code, String message) {
        ApiResponse<T> r = new ApiResponse<>();
        r.setCode(code);
        r.setMessage(message);
        return r;
    }

    public static ApiResponse<Void> fail(String message) {
        return fail(1, message);
    }
}
