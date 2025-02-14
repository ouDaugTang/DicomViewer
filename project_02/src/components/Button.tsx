
interface Props {
    onPress: () => void;
    bgc?: string;
    label: string;
    py: string;
    px: string;
    isNavigation?: boolean;
}

const Button = ({ onPress, bgc, label, py, px, isNavigation }: Props) => {
    return (
        <button onClick={onPress} className={`${isNavigation ? `${bgc} h-[48px]` : ' '} ${py} ${px} flex justify-center items-center`}>
            <span className={`${isNavigation ? 'px-[16px] text-white' : ' '} font-medium font-custom`}>
                {label}
            </span>
        </button>
    )
}

export default Button