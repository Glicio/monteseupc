import { type NextPage } from "next";
import MainLayout from "../../layouts/main";
import LinkCard from "../../components/misc/linkCard";
import Gpu from "../../components/svg/gpu";
import CPU from "../../components/svg/cpu";
import Mobo from "../../components/svg/mobo";
import RAM from "../../components/svg/ram";
import Bolt from "../../components/svg/bolt";
import Gabinete from "../../components/svg/gabinete";
import HDD from "../../components/svg/hdd";
import CPUCooler from "../../components/svg/cpuCooler";
import Fan from "../../components/svg/fan";
import Computer from "../../components/svg/computer";
import Keyboard from "../../components/svg/keyboard";
import Mouse from "../../components/svg/mouse";

const Parts: NextPage = () => {
  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className=" flex gap-4 flex-wrap justify-center p-2 max-w-[60rem]">
          <LinkCard href="/parts/ram" label="Memórias RAM" icon={<RAM/>}/>
          <LinkCard href="/parts/mobo" label="Placas Mãe" icon={<Mobo/>}/>
          <LinkCard href="/parts/cpu" label="Processadores" icon={<CPU/>}/>
          <LinkCard href="/parts/gpu" label="Placas de Vídeo" icon={<Gpu/>}/>
          <LinkCard href="/parts/psu" label="Fontes de Alim." icon={<Bolt/>}/>
          <LinkCard href="/parts/case" label="Gabinetes" icon={<Gabinete/>}/>
          <LinkCard href="/parts/storage" label="Armazenamento" icon={<HDD/>}/>
          <LinkCard href="/parts/cooler" label="CPU Cooler" icon={<CPUCooler/>}/>
          <LinkCard href="/parts/fan" label="Fans" icon={<Fan/>}/>
          <LinkCard href="/parts/monitor" label="Monitores" icon={<Computer/>}/>
          <LinkCard href="/parts/keyboard" label="Teclados" icon={<Keyboard/>}/>
          <LinkCard href="/parts/mouse" label="Mouses" icon={<Mouse/>}/>
        </div>
      </div>
    </MainLayout>
  );
};

export default Parts;
