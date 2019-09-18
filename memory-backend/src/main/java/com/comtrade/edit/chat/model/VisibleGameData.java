/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.comtrade.edit.chat.model;

import java.util.ArrayList;
import java.util.Vector;

/**
 *
 * @author DT User
 */
public class VisibleGameData {
    
private String username;
    private int numberOfPlayers;
    private int rows;
    private ArrayList<User> users = new ArrayList<User>();
    
    public ArrayList<User> getUsers() {
        return users;
    }

    public void setUsers(ArrayList<User> users) {
        this.users = users;
    }

    public int getNumberOfPlayers() {
        return numberOfPlayers;
    }

    public void setNumberOfPlayers(int numberOfPlayers) {
        this.numberOfPlayers = numberOfPlayers;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
       this.username=username;
    }

    
}

