import { Input, Slider, Grid, Text, Checkbox, Collapse, Code } from '@geist-ui/react';
import React, { useState } from 'react';
import CodeOutput from '@lib/CodeOutput';

// Main code for the app

const CodegenApp: React.FC<{}> = () => {
    const [name, setName] = useState('');
    const [args, setArgs] = useState(2);
    const [savedRegisters, setSavedRegisters] = useState(3);
    const [saveRA, setSaveRA] = useState(true);
    const [addComments, setAddComments] = useState(true);
    const [copya0, setCopyA0] = useState(0);

    const settings = {
        name, setName,
        args, setArgs,
        savedRegisters, setSavedRegisters,
        addComments, setAddComments,
        saveRA, setSaveRA
    };
    const advancedSettings = { copya0, setCopyA0, savedRegisters };
    const codeOutputProps = { name, args, savedRegisters, addComments, copya0, saveRA };
    return (
        <Grid.Container gap={4}>
            <Grid xs={24}>
                <Collapse.Group style={{ width: '100%' }}>
                    <Collapse title='Settings' initialVisible>
                        <Options {...settings} />
                    </Collapse>
                    <Collapse title='Advanced Settings'>
                        <AdvancedOptions {...advancedSettings} />
                    </Collapse>
                </Collapse.Group>
            </Grid>
            <Grid xs={24}>
                <CodeOutput {...codeOutputProps} />
            </Grid>
        </Grid.Container>
    )
}

interface OptionsProps {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    args: number;
    setArgs: React.Dispatch<React.SetStateAction<number>>;
    savedRegisters: number;
    setSavedRegisters: React.Dispatch<React.SetStateAction<number>>;
    addComments: boolean;
    setAddComments: React.Dispatch<React.SetStateAction<boolean>>;
    saveRA: boolean;
    setSaveRA: React.Dispatch<React.SetStateAction<boolean>>;
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
                <Grid xs={24}><Text h5>Arguments:</Text></Grid>
                <Grid xs={23}>
                    <Slider
                        step={1}
                        value={props.args}
                        onChange={(e) => props.setArgs(e)}
                        min={0}
                        max={8}
                        showMarkers />
                </Grid>
            </Grid.Container>
        </Grid>
        <Grid xs={24}>
            <Grid.Container gap={1} justify='center'>
                <Grid xs={24}><SavedRegistersText registers={props.savedRegisters} /></Grid>
                <Grid xs={23}>
                    <Slider
                        step={1}
                        value={props.savedRegisters}
                        onChange={(e) => props.setSavedRegisters(e)}
                        min={0}
                        max={12}
                        showMarkers />
                </Grid>
            </Grid.Container>
        </Grid>
        <Grid xs={24}>
            <Grid.Container gap={1} justify='center'>
                <Grid xs={24}>
                    <Checkbox checked={props.addComments} onChange={(e) => props.setAddComments(e.target.checked)}>Add Comments</Checkbox>
                </Grid>
                <Grid xs={24}>
                    <Checkbox checked={props.saveRA} onChange={(e) => props.setSaveRA(e.target.checked)}>
                        Save <Code>ra</Code>
                    </Checkbox>
                </Grid>
            </Grid.Container>
        </Grid>
    </Grid.Container >
)

interface AdvancedOptionsProps {
    copya0: number;
    setCopyA0: React.Dispatch<React.SetStateAction<number>>;
    savedRegisters: number;
}
const AdvancedOptions: React.FC<AdvancedOptionsProps> = (props) => {
    const disabled = props.savedRegisters === 0;
    const fontType = disabled ? 'secondary' : 'default';
    return (
        <Grid.Container gap={5}>
            <Grid xs={24}>
                <Grid.Container gap={1} justify='center'>
                    <Grid xs={24}><Text h5 type={fontType}>Copy Arguments into saved registers</Text></Grid>
                    <Grid xs={23}>
                        <Slider
                            value={props.copya0}
                            onChange={props.setCopyA0}
                            min={0}
                            max={Math.max(props.savedRegisters, 1)}
                            showMarkers
                            disabled={disabled}
                        />
                    </Grid>
                </Grid.Container>
            </Grid>
        </Grid.Container>
    )
}

const SavedRegistersText: React.FC<{ registers: number }> = ({ registers }) => {
    if (registers === 0) {
        return <Text h5>No registers saved (Not using stack)</Text>
    } else if (registers === 1) {
        return <Text h5>1 register saved</Text>
    } else {
        return <Text h5>{registers} registers saved</Text>
    }
}

export default CodegenApp;