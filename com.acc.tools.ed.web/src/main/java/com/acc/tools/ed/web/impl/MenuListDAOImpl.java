package com.acc.tools.ed.web.impl;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.acc.tools.ed.integration.dao.impl.AbstractEdbDao;
import com.acc.tools.ed.web.dao.MenuListDAO;
import com.acc.tools.ed.web.dto.PrivilegesDTO;
import com.acc.tools.ed.web.dto.UserRoles;

@Service("menuListDAO")
public class MenuListDAOImpl extends AbstractEdbDao implements MenuListDAO {
	
	private final Logger log=LoggerFactory.getLogger(MenuListDAOImpl.class);

	public List<PrivilegesDTO> getAllMenuList() throws IOException, SQLException {
		final Connection connection=getConnection();
		Statement stmt=connection.createStatement();
		final String sqlQuery="SELECT ID, MENU_NAME, PARENT_ID FROM MENUMASTER ORDER BY PARENT_ID, ID";
		log.debug(sqlQuery);
		System.out.println(sqlQuery);
		final ResultSet resultSet = stmt.executeQuery(sqlQuery);
		List<PrivilegesDTO> menuList = new ArrayList<PrivilegesDTO>();
		while (resultSet.next()) {
			PrivilegesDTO privileges = new PrivilegesDTO();
			privileges.setKey(resultSet.getInt("ID"));
			privileges.setTitle(resultSet.getString("MENU_NAME"));
			privileges.setParentId(resultSet.getInt("PARENT_ID"));
			menuList.add(privileges);
		};

		System.out.println(menuList);	
	
		return menuList;
	}

	
	public List<UserRoles> getUserRoles() throws IOException, SQLException {
		final Connection connection=getConnection();
		Statement stmt=connection.createStatement();
		final String sqlQuery="SELECT ID, ROLE_NAME FROM USER_ROLES ORDER BY ROLE_NAME";
		log.debug(sqlQuery);
		System.out.println(sqlQuery);
		final ResultSet resultSet = stmt.executeQuery(sqlQuery);
		List<UserRoles> rolesList = new ArrayList<UserRoles>();
		
		while (resultSet.next()) {
			UserRoles role = new UserRoles();
			role.setRoleId(resultSet.getInt("ID"));
			role.setRoleName(resultSet.getString("ROLE_NAME"));
			
			rolesList.add(role);
		};

		System.out.println(rolesList);	
	
		return rolesList;
	}

	public String getRoleSpecificMenus(String RoleId)  throws IOException, SQLException {
		final Connection connection=getConnection();
		Statement stmt=connection.createStatement();
		final String sqlQuery="SELECT URM.MENU_ID FROM USER_ROLES_MENU URM, MENUMASTER MM WHERE URM.MENU_ID= MM.ID "
				+ "AND MM.PARENT_ID <>0 AND URM.ROLE_ID = " + RoleId ;
		log.debug(sqlQuery);
		System.out.println(sqlQuery);
		final ResultSet resultSet = stmt.executeQuery(sqlQuery);
		StringBuffer roleSpecificMenu = new StringBuffer();
		
		while (resultSet.next()) {
			
			roleSpecificMenu.append(resultSet.getInt("MENU_ID")+",");
		};

		System.out.println(roleSpecificMenu);	
	
		return roleSpecificMenu.substring(0, roleSpecificMenu.length()-1);
	}


	public String updateRoleSpecificMenus(String userRole, String[] selectedMenuList)  throws IOException, SQLException{
		final Connection connection=getConnection();
		
		removeRoleSpecificMenus(connection, userRole);
		
		//Statement stmt=connection.createStatement();
		final String sqlQuery="INSERT INTO USER_ROLES_MENU (MENU_ID, ROLE_ID) VALUES(?,?)" ;
		PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
		log.debug(sqlQuery);
		System.out.println(sqlQuery);
		for(String menuId: selectedMenuList) {
			System.out.println(menuId.trim());
			preparedStatement.setInt(1, Integer.parseInt(menuId.trim()));
			preparedStatement.setInt(2, Integer.parseInt(userRole.trim()));
			preparedStatement.addBatch();
		}
		System.out.println(preparedStatement);
		preparedStatement.executeBatch();
		connection.commit();
		System.out.println(preparedStatement.getUpdateCount());
		return "Records are inserted successfully";
	}

	private void removeRoleSpecificMenus(Connection connection, String RoleId)  throws IOException, SQLException {
		
		Statement stmt=connection.createStatement();
		final String sqlQuery ="DELETE FROM USER_ROLES_MENU WHERE ROLE_ID = " + RoleId ;
		log.debug(sqlQuery);
		System.out.println(sqlQuery);
		stmt.executeUpdate(sqlQuery);
	}

}
