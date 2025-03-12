export const navItems = [
    {
      name: "Dashboard",
      icon: "/assets/icons/dashboard.svg",
      url: "/"
    },
    {
      name: "Documents",
      icon: "/assets/icons/documents.svg",
      url: "/documents"
    },
    {
      name: "Images",
      icon: "/assets/icons/images.svg",
      url: "/images"
    },
    {
      name: "Media",
      icon: "/assets/icons/video.svg",
      url: "/media"
    },
    {
      name: "Others",
      icon: "/assets/icons/others.svg",
      url: "/others"
    },
    {
      name: "Shared",
      icon: "/assets/icons/shared.png",
      url: "/shared"
    },
    {
      name: "Trash",
      icon: "/assets/icons/trash.svg",
      url: "/trash"
    }
];

export const actionsDropdownItems = [
    {
      label: "Rename",
      icon: "/assets/icons/edit.svg",
      value: "rename",
    },
    {
      label: "Details",
      icon: "/assets/icons/info.svg",
      value: "details",
    },
    {
      label: "Share",
      icon: "/assets/icons/share.svg",
      value: "share",
    },
    {
      label: "Download",
      icon: "/assets/icons/download.svg",
      value: "download",
    },
    {
      label: "Move to Trash",
      icon: "/assets/icons/delete.svg",
      value: "moveToTrash",
    },
  ];

export const sharedFileActions = [
   
    {
      label: "Details",
      icon: "/assets/icons/info.svg",
      value: "details",
    },
    {
      label: "Download",
      icon: "/assets/icons/download.svg",
      value: "download",
    },
    {
      label: "Edit",
      icon: "/assets/icons/edit.svg",
      value: "edit"
    }
];

export const trashFileActions = [
   
    {
      label: "Restore",
      icon: "/assets/icons/restore.svg",
      value: "restore",
    },
    {
      label: "Delete Permanently",
      icon: "/assets/icons/delete.svg",
      value: "delete",
    }
];

export const sortTypes = [
  {
    label: "Date created (newest)",
    value: "date-desc",
  },
  {
    label: "Date created (oldest)",
    value: "date-asc",
  },
  {
    label: "Name (A-Z)",
    value: "name-asc",
  },
  {
    label: "Name (Z-A)",
    value: "name-desc",
  },
  {
    label: "Size (Highest)",
    value: "size-desc",
  },
  {
    label: "Size (Lowest)",
    value: "size-asc",
  },
];
  
export const avatarPlaceholderUrl = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png";
export const MAX_FILE_SIZE = 50 * 1024 * 1024;