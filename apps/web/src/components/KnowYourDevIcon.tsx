import SvgIcon from '@mui/joy/SvgIcon';

export default function KnowYourDevIcon(props: React.ComponentProps<typeof SvgIcon>) {
    return (
        <SvgIcon {...props} viewBox="0 0 100 100" sx={{background: 'transparent'}}>
            <circle cx="50" cy="50" r="45" fill="#FF9F00"/>

            {/*<path*/}
            {/*    d="M35  55 L46 66 L68 38"*/}
            {/*    stroke="white"*/}
            {/*    strokeWidth="8"*/}
            {/*    strokeLinecap="round"*/}
            {/*    strokeLinejoin="round"*/}
            {/*    fill="none"*/}
            {/*/>*/}

            {/* White dot in the center */}
            {/*<circle cx="50" cy="50" r="20" fill="white"/>*/}


            {/* White sector from 0° to 35° */}
            <path
                d="
          M 40 50
          L 95 50
          A 45 45 0 0 1 86.8 23.6
          Z
        "
                fill="white"
            />
        </SvgIcon>
    );
}
