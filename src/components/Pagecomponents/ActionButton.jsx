import { Tooltip, Button } from "antd"
export const ActionButton=({title, shape, icon, ...props})=>{
    return (
        <Tooltip title={title}>
            <Button shape={shape || 'circle'} size='small' {...props}>
                {
                    icon
                }
            </Button>
        </Tooltip>
    )
}