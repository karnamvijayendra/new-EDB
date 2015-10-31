package com.acc.tools.ed.web.impl;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.acc.tools.ed.web.dao.MenuListDAO;
import com.acc.tools.ed.web.dto.PrivilegesDTO;
import com.acc.tools.ed.web.dto.UserRoles;
import com.acc.tools.ed.web.service.PrivilegeService;

@Service("privilegesService")
public class PrivilegesServiceImpl implements PrivilegeService {
	
	@Autowired
	private MenuListDAO menuListDAO;
	
	public List<PrivilegesDTO> getAllMenuList() throws IOException, SQLException {
		
		List<PrivilegesDTO> allMenuList = new ArrayList<PrivilegesDTO>();
		
		List<PrivilegesDTO> sampleList = menuListDAO.getAllMenuList();
		
		Map<Integer, PrivilegesDTO> sampleMap = new HashMap<Integer, PrivilegesDTO>();
		for(PrivilegesDTO sample: sampleList){
			if(sample.getParentId() == 0){
				sampleMap.put(sample.getKey(), sample);
			} else {
				if(sampleMap.get(sample.getParentId()) == null){
					List<PrivilegesDTO> childElements = getChildren(sample.getParentId(),sampleMap);
					childElements.add(sample);
				} else {
					sampleMap.get(sample.getParentId()).getChildren().add(sample);
				}
			}
		}
		
		for(int key : sampleMap.keySet()){
			allMenuList.add(sampleMap.get(key));
		}
		
		System.out.println(sampleMap);
		
		return allMenuList;
	}
	
	private List<PrivilegesDTO> getChildren(int parentId,
			Map<Integer, PrivilegesDTO> sampleMap) {
		List<PrivilegesDTO> childElements = null;
		for(int key : sampleMap.keySet()){
			PrivilegesDTO privileges = sampleMap.get(key);
			if(null != privileges.getChildren() && privileges.getChildren().size()> 0) {
				childElements = getSubChildElements(parentId,privileges);
				if(childElements != null){
					break;
				}
				
			}
			
		}
		
		return childElements;
	}

	private List<PrivilegesDTO> getSubChildElements(int parentId,PrivilegesDTO privileges){
		List<PrivilegesDTO> childElements = null;
		for(PrivilegesDTO childElement : privileges.getChildren()){
			if(childElement.getKey() == parentId){
				childElements = childElement.getChildren();
				
				break;
			} else {
				if(childElement.getChildren().size() > 0) {
					childElements = getSubChildElements(parentId,childElement);
				}
			}
		}
		return childElements;
	}


	public List<UserRoles> getUserRoles() throws IOException, SQLException {
		List<UserRoles> userRoles = menuListDAO.getUserRoles();
		return userRoles;
	}
	
	

	public String getRoleSpecificMenus(String roleId) throws IOException, SQLException {
		String roleSpecificMenus = menuListDAO.getRoleSpecificMenus(roleId);
		return roleSpecificMenus;
	}

	
	public String updateRoleSpecificMenus(String userRole, String[] selectedMenuList) throws IOException, SQLException {
		String msg = menuListDAO.updateRoleSpecificMenus(userRole, selectedMenuList);
		System.out.println(msg);
		return msg;
	}
	
}
