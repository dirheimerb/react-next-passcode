export default async function getPermission(): Promise<PermissionStatus | null> {
  const permissionName = 'clipboard-read' as PermissionName
  try {
    const permission = await navigator.permissions.query({
      name: permissionName,
    })

    if (permission.state === 'denied') {
      console.log('Request was denied: ', permissionName, permission.state)
    } else if (permission.state === 'granted') {
      console.log('Permission was granted: ', permissionName, permission.state)
    } else {
      console.log(
        'Permission requires user response: ',
        permissionName,
        permission.state,
      )
    }

    return permission
  } catch (error) {
    console.error(error)
    return null
  }
}
