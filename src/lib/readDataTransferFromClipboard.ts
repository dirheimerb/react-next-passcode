export async function readDataTransferFromClipboard(document: Document) {
  const window = document.defaultView
  const clipboard = window?.navigator.clipboard
  const items = clipboard && (await clipboard.read())

  if (!items) {
    throw new Error('The Clipboard API is unavailable.')
  }

  const dt = createDataTransfer(window)
  for (const item of items) {
    for (const type of item.types) {
      dt.setData(
        type,
        await item
          .getType(type)
          .then((b) => readBlobText(b, window.FileReader)),
      )
    }
  }
  return dt
}
testing - library / user - event / Clipboard.ts

export function useClipboard(): UseClipboard {
  const supported = isClient && 'clipboard' in navigator
  const text = ref<string>()
  const data = ref<DataTransfer>()

  const writeText = (data: string) => {
    text.value = data
    if (!supported) return Promise.resolve()
    // TOOD check for permissions
    return navigator.clipboard.writeText(data)
  }

  const write = (data: ClipboardItem[]) => {
    if (!supported) return Promise.resolve()
    // TOOD check for permissions
    // @ts-ignore
    return navigator.clipboard.write(data)
  }

  let readText: () => Promise<string | undefined> = () =>
    Promise.resolve(undefined)

  // @ts-ignore
  let read: () => Promise<DataTransfer | undefined> = readText

  if (supported) {
    let updating = false
    const update = () => readText().then((x) => (text.value = x))
    ;(['copy', 'cut', 'focus'] as const).map((event) =>
      useEvent(window, event, () => update()),
    )

    readText = () =>
      navigator.clipboard.readText().then((x) => {
        try {
          updating = true
          return (text.value = x)
        } finally {
          // case of a sync watch it might throw
          updating = false
        }
      })

    // @ts-ignore this should work
    read = () => navigator.clipboard.read().then((x) => (data.value = x))

    watch(
      text,
      debounce((s: string) => {
        if (updating || !isString(s)) return
        writeText(s)
      }, 100),
    )
  }

  return {
    supported,
    text,
    data,

    writeText,
    readText,

    write,
    read,
  }
}
pikax / vue - composable / clipboard.ts

export default function useLayerMenu(
  layers: Sketch.AnyLayer[],
  interactionType: InteractionType,
) {
  const dispatch = useDispatch()
  // TODO:
  const openDialog = useCallback((n: string) => n, []) // useOpenInputDialog();
  const { startRenamingLayer } = useWorkspace()

  const isEditingText = Selectors.getIsEditingText(interactionType)

  const hasSelectedLayers = layers.length > 0

  const canUngroup = layers.length === 1 && Layers.isGroup(layers[0])

  const canDetach = layers.length === 1 && Layers.isSymbolInstance(layers[0])

  const canBeMask = layers.every((layer) =>
    isValidClippingMaskType(layer._class),
  )

  const canBeMaskChainBreaker = layers.every((layer) =>
    isValidMaskChainBreakerType(layer._class),
  )

  const canBeSymbol = useMemo(() => {
    return (
      layers.length >= 1 &&
      !layers.some(Layers.isSymbolMaster) &&
      (layers.every(Layers.isArtboard) ||
        layers.every((item) => !Layers.isArtboard(item)))
    )
  }, [layers])

  const newUseAsMaskValue = !layers.every((item) => item.hasClippingMask)

  const newIsAlphaMaskValue = !layers.every(
    (item) => item.clippingMaskMode === 1,
  )

  const newIgnoreMasksValue = !layers.every((item) => item.shouldBreakMaskChain)

  const canUnlock = layers.some((layer) => layer.isLocked)

  const canShow = layers.some((item) => !item.isVisible)

  const menuConfig: MenuConfig<LayerMenuItemType> = useMemo(() => {
    const selectAllSection: RegularMenuItem<LayerMenuItemType>[] = [
      { value: 'selectAll', title: 'Select All', shortcut: 'Mod-a' },
    ]

    if (!hasSelectedLayers) return [selectAllSection]

    return [
      [
        canBeSymbol && {
          value: 'createSymbol',
          title: 'Create Symbol',
        },
        canDetach && {
          value: 'detachSymbol',
          title: 'Detach Symbol',
        },
      ],
      [
        { value: 'rename', title: 'Rename' },
        { value: 'group', title: 'Group', shortcut: 'Mod-g' },
        canUngroup && {
          value: 'ungroup',
          title: 'Ungroup',
          shortcut: 'Mod-Shift-g',
        },
      ],
      [{ value: 'duplicate', title: 'Duplicate', shortcut: 'Mod-d' }],
      [{ value: 'delete', title: 'Delete' }],

      [{ value: 'copy', title: 'Copy' }],
      [
        canUnlock
          ? { value: 'unlock', title: 'Unlock', shortcut: 'Mod-Shift-l' }
          : { value: 'lock', title: 'Lock', shortcut: 'Mod-Shift-l' },
        canShow
          ? { value: 'show', title: 'Show', shortcut: 'Mod-Shift-h' }
          : { value: 'hide', title: 'Hide', shortcut: 'Mod-Shift-h' },
      ],
      [
        canBeMask && {
          value: 'useAsMask',
          title: 'Use as mask',
          checked: !newUseAsMaskValue,
        },
        canBeMask && {
          value: 'isAlphaMask',
          title: 'Mask using alpha',
          checked: !newIsAlphaMaskValue,
        },
        canBeMaskChainBreaker && {
          value: 'ignoreMasks',
          title: 'Ignore masks',
          checked: !newIgnoreMasksValue,
        },
      ],
      selectAllSection,
    ]
  }, [
    canBeMask,
    canBeMaskChainBreaker,
    canBeSymbol,
    canDetach,
    canShow,
    canUngroup,
    canUnlock,
    hasSelectedLayers,
    newIgnoreMasksValue,
    newIsAlphaMaskValue,
    newUseAsMaskValue,
  ])

  const menuItems: MenuItem<LayerMenuItemType>[] = useMemo(
    () => createSectionedMenu(...menuConfig),
    [menuConfig],
  )

  const selectedLayerIds = useShallowArray(
    layers.map((layer) => layer.do_objectID),
  )

  const onSelectMenuItem = useCallback(
    async (value: LayerMenuItemType) => {
      switch (value) {
        case 'selectAll':
          if (isEditingText) {
            dispatch('selectAllText')
          } else {
            dispatch('selectAllLayers')
          }
          return
        case 'delete':
          dispatch('deleteLayer', selectedLayerIds)
          return
        case 'copy':
          const isSafari = /Apple Computer/.test(navigator.vendor)

          if (isSafari) {
            const range = document.createRange()
            range.selectNode(document.body)

            window.getSelection()?.removeAllRanges()
            window.getSelection()?.addRange(range)
          }

          document.execCommand('copy')

          if (isSafari) {
            window.getSelection()?.removeAllRanges()
          }

          return
        case 'paste':
          // Works on safari
          document.execCommand('paste')

          const paste = async () => {
            try {
              // @ts-ignore (TS says that .read() doesn't exist but it does >,<)
              const clipboardItems = await navigator.clipboard.read()

              for (const clipboardItem of clipboardItems) {
                const blob = await clipboardItem.getType('text/html')
                const blobText = await blob.text()

                if (!blobText) return

                const layers = ClipboardUtils.fromEncodedHTML(blobText) as
                  | Sketch.AnyLayer[]
                  | undefined

                if (!layers) return

                dispatch('addLayer', layers)
              }
            } catch (e) {
              console.warn('Failed to paste')
            }
          }

          paste()
          return
        case 'duplicate':
          dispatch('duplicateLayer', selectedLayerIds)
          return
        case 'group': {
          dispatch('groupLayers', selectedLayerIds)
          return
        }
        case 'ungroup':
          dispatch('ungroupLayers', selectedLayerIds)
          return
        case 'createSymbol': {
          const name = await openDialog('New Symbol Name')

          if (!name) return

          dispatch('createSymbol', selectedLayerIds, name)
          return
        }
        case 'detachSymbol': {
          dispatch('detachSymbol', selectedLayerIds)
          return
        }
        case 'useAsMask': {
          dispatch('setHasClippingMask', newUseAsMaskValue)
          return
        }
        case 'ignoreMasks': {
          dispatch('setShouldBreakMaskChain', newIgnoreMasksValue)
          return
        }
        case 'isAlphaMask':
          dispatch('setMaskMode', newIsAlphaMaskValue ? 'alpha' : 'outline')
          return
        case 'lock': {
          dispatch('setLayerIsLocked', selectedLayerIds, true)
          return
        }
        case 'unlock': {
          dispatch('setLayerIsLocked', selectedLayerIds, false)
          return
        }
        case 'show': {
          dispatch('setLayerVisible', selectedLayerIds, true)
          return
        }
        case 'hide': {
          dispatch('setLayerVisible', selectedLayerIds, false)
          return
        }
        case 'rename': {
          startRenamingLayer(selectedLayerIds[0])
          return
        }
      }
    },
    [
      isEditingText,
      dispatch,
      selectedLayerIds,
      newIsAlphaMaskValue,
      openDialog,
      newUseAsMaskValue,
      newIgnoreMasksValue,
      startRenamingLayer,
    ],
  )

  return [menuItems, onSelectMenuItem] as const
}
