package com.web.bigdata.model.service;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import com.web.bigdata.model.UserDto;
import com.web.bigdata.model.ReviewDto;

public interface UserService {

	// UserController
	/** 회원 목록을 List로 반환 */
	public List<UserDto> getAllUser() throws Exception;

	/** 회원의 권한 반환 */
	public String getRole(String email) throws Exception;

	/** 인자로 UserDto를 생성 */
	public void join(UserDto dto) throws Exception;

	/** 인자로 받은 email의 중복 여부 */
	public boolean emailCheck(String email);

	/** 인자로 받은 name의 중복 여부 */
	public boolean nameCheck(String name);

	/** 인자로 받은 email의 비밀번호를 반환 */
	public UserDto findUserInfo(String email) throws Exception;

	/** 인자로 받은 UserDto의 비밀번호를 수정하고, 성공 여부를 반환 */
	public boolean updatePwd(UserDto userDto) throws Exception;

	/** 인자로 받은 email의 User를 삭제하고, 성공 여부를 반환 */
	public boolean delete(String email) throws Exception;

	/** 인자로 받은 UserDto로 프로필을 설정 */
	public void saveImg(UserDto userDto) throws IOException, SQLException;

	/** 인자로 받은 email의 프로필 사진을 삭제 */
	public void deleteImg(String email);

	// LoginController
	/** id, pwd와 일치하는 UserDto를 반환 */
	public UserDto login(UserDto dto) throws Exception;

//	/** 게시글 리스트 */
//	public List<ReviewDto> getPostList(String email) throws Exception;

}