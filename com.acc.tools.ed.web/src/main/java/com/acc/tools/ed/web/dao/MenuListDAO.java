package com.acc.tools.ed.web.dao;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import com.acc.tools.ed.integration.dao.impl.AbstractEdbDao;

import com.acc.tools.ed.web.dto.PrivilegesDTO;
import com.acc.tools.ed.web.dto.UserRoles;

public interface MenuListDAO {
	
	public List<PrivilegesDTO> getAllMenuList()  throws IOException, SQLException;
	public List<UserRoles> getUserRoles()  throws IOException, SQLException;
	public String getRoleSpecificMenus(String RoleId)  throws IOException, SQLException;
	public String updateRoleSpecificMenus(String userRole, String[] selectedMenuList) throws IOException, SQLException;

}
