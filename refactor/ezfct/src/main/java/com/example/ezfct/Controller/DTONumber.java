package com.example.ezfct.Controller;

public class DTONumber {
    private int value;

    public DTONumber(int n) {
        value = n;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int n) {
        this.value = n;
    }

    public DTONumber() {
        // empty constructor
    }
}
