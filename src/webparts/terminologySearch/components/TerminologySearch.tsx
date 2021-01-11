import * as React from 'react';
import styles from './TerminologySearch.module.scss';
import { ITerminologySearchProps } from './ITerminologySearchProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ListItemPicker } from '@pnp/spfx-controls-react/lib/ListItemPicker';
import {
  TagPicker,
  IBasePicker,
  ITag,
  IInputProps,
  IBasePickerSuggestionsProps,
} from 'office-ui-fabric-react/lib/Pickers';
import { Toggle, IToggleStyles } from 'office-ui-fabric-react/lib/Toggle';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { useBoolean } from '@uifabric/react-hooks';


import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

import { sp } from '@pnp/sp/presets/all';

interface ITerminologyListItem {
  Id: number;
  Title: string;
  Description: string; 
}

interface ITerminologySearchState {
  data: ITerminologyListItem[],
  selectedItem: ITerminologyListItem
}

export default class TerminologySearch extends React.Component<ITerminologySearchProps, ITerminologySearchState> {

  constructor(props: any) {
    super(props);
    
    this.state = {
      data: [],
      selectedItem: null
    };
  }

 

private onSelectedItem = async (data: { key: string; name: string }[]) => {
  for (const item of data) {
    console.log(`Item value: ${item.key}`);
    console.log(`Item text: ${item.name}`);
  }

  let web = sp.web;

  let list= web.lists.getByTitle('Terminology Dictionary');

  // verify that there is an item in data array
  let item: any = await list.items.getById(parseInt(data[0].key, 10)).get();
  this.setState({
    selectedItem: item
  })
}

  

  public async componentDidMount() {

    // Get reference to the current web (Site) that the web part is in.
    let web = sp.web;

    let webInfo = await web.get();  

    // Get reference tot the list on that web (Site).
    let list= web.lists.getByTitle('Terminology Dictionary');

    let fields = await list.fields.get();
    console.log(fields);
    // Get the items from that list
    let items: ITerminologyListItem[] = await list.items.getAll(); 
    
    // store items onto the state
    this.setState({
      data: items
    });
  }

  public render(): React.ReactElement<ITerminologySearchProps> {
    // let itemDom;
    //  if (this.state.selectedItem) {
    //    itemDom = <div>
    //    {this.state.selectedItem.Title}
    //    </div>
    //    {this.state.selectedItem.Description}     
    //  } else {
    //    itemDom = '';
    //  }
     
    return (
      <div className={ styles.terminologySearch }>
        <div>
          <div>
            <div> 
              <div className={styles.fieldlabel}>Jargon Search</div>  
              <div>        
              <ListItemPicker listId='ff8be085-02b0-49c7-bade-f9a60db6b8e5'
                columnInternalName='Title'
                keyColumnInternalName='Id'
                noResultsFoundText="No data to display"
                suggestionsHeaderText="Searching"
                itemLimit={1}
                onSelectedItem={this.onSelectedItem}
                substringSearch={true}
                context={this.props.context}
                placeholder="Search for a Term"
               // className={styles.list}
                 />
              </div>   
              
              {null !== this.state.selectedItem &&
              <p>
               <div className={styles.list}>
                 <div className={styles.bold}>
                 {this.state.selectedItem.Title}
                 </div>
                 {this.state.selectedItem.Description}
               </div>
               </p>
              }  
              {/* {itemDom}             */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
