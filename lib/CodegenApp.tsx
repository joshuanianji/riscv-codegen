import { Input, Slider, Grid, Text, Spacer, Divider, Checkbox, Collapse } from '@geist-ui/react';
import React, { useState } from 'react';

// Main code for the app

const CodegenApp: React.FC<{}> = () => {
    const [name, setName] = useState('');
    const [sliderValue, setSliderValue] = useState(3);
    const [addComments, setAddComments] = useState(true);
    const [copya0, setCopyA0] = useState(0);

    const settings = { name, setName, sliderValue, setSliderValue, addComments, setAddComments };
    const advancedSettings = { copya0, setCopyA0, sliderValue };
    return (
        <Collapse.Group style={{ width: '100%' }}>
            <Collapse title='Settings' initialVisible>
                <Options {...settings} />
            </Collapse>
            <Collapse title='Advanced Settings'>
                <AdvancedOptions {...advancedSettings} />
            </Collapse>
        </Collapse.Group>
    )
}

interface OptionsProps {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    sliderValue: number;
    setSliderValue: React.Dispatch<React.SetStateAction<number>>;
    addComments: boolean;
    setAddComments: React.Dispatch<React.SetStateAction<boolean>>;
}
const Options: React.FC<OptionsProps> = (props) => (
    <Grid.Container gap={5}>
        <Grid xs={24}>
            <Input placeholder='funcName' value={props.name} onChange={(e) => props.setName(e.target.value)}>
                Function Name
            </Input>
        </Grid>
        <Grid xs={24}>
            <Grid.Container gap={1} justify='center'>
                <Grid xs={24}><SavedRegistersText registers={props.sliderValue} /></Grid>
                <Grid xs={22}><Slider step={1} value={props.sliderValue} onChange={props.setSliderValue} min={0} max={12} showMarkers /></Grid>
            </Grid.Container>
        </Grid>
        <Grid xs={24}>
            <Checkbox checked={props.addComments} onChange={(e) => props.setAddComments(e.target.checked)}>Add Comments</Checkbox>
        </Grid>
    </Grid.Container >
)

interface AdvancedOptionsProps {
    copya0: number;
    setCopyA0: React.Dispatch<React.SetStateAction<number>>;
    sliderValue: number;
}
const AdvancedOptions: React.FC<AdvancedOptionsProps> = (props) => {
    return (
        <Grid.Container gap={5}>
            <Grid xs={24}>
                <Grid.Container gap={1} justify='center'>
                    <Grid xs={24}>Copy Arguments into saved registers</Grid>
                    <Grid xs={22}>
                        <Slider
                            step={1}
                            value={props.copya0}
                            onChange={props.setCopyA0}
                            min={0}
                            max={Math.max(props.sliderValue, 1)}
                            showMarkers
                            disabled={props.sliderValue === 0}
                        />
                    </Grid>
                </Grid.Container>
            </Grid>
        </Grid.Container>
    )
}

const SavedRegistersText: React.FC<{ registers: number }> = ({ registers }) => {
    if (registers === 0) {
        return <Text h4>No registers saved (Not using stack)</Text>
    } else if (registers === 1) {
        return <Text h4>1 register saved</Text>
    } else {
        return <Text h4>{registers} registers saved</Text>
    }
}

export default CodegenApp;