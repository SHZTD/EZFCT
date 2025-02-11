package com.example.ezfct_api.Controller;

public class DtoNumber {
    int number;
    public DtoNumber(int a){
        number = a;
    }
    public int getNumber() {
        return number;
    }
    public void setNumber(int number) {
        this.number = number;
    }
    public DtoNumber(){};
}
