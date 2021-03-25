package com.web.bigdata.model;

public class BookmarkDto {
	private String id_bookmark;
	private String id_store;
	private String id_user;
	private int active;
	
	public String getId_bookmark() {
		return id_bookmark;
	}
	public void setId_bookmark(String id_bookmark) {
		this.id_bookmark = id_bookmark;
	}
	public String getId_user() {
		return id_user;
	}
	public void setId_user(String id_user) {
		this.id_user = id_user;
	}
	public String getId_store() {
		return id_store;
	}
	public void setId_store(String id_store) {
		this.id_store = id_store;
	}
	public int getActive() {
		return active;
	}
	public void setActive(int active) {
		this.active = active;
	}
	@Override
	public String toString() {
		return "BookmarkDto [id_bookmark=" + id_bookmark + ", id_user=" + id_user + ", id_store=" + id_store
				+ ", active=" + active + "]";
	}
}
